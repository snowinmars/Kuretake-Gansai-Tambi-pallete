import nodeHtmlToImage from 'node-html-to-image'
import {Color, colors} from './palette';
import {writeFileSync} from 'fs';

const getLuma = ([r, g, b]: number[]): number => {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}

const buildRows = (colors: Color[]) => {
	return colors.map(color => {
		const luma = getLuma(color.rgb)
		const isDark = luma < 80;
		const rowStyle = `width: 8em; height: 2em; padding: 0.2em 0.5em; background-color: ${color.hex}; color: ${isDark ? 'white' : 'black'};`;

		return `<td style="${rowStyle}">${color.hex} </td>`
	})
}


export const bucketize = <T>(array: readonly T[], size = 100): readonly (readonly T[])[] =>
// @ts-ignore
    ([]).concat(...array.map((elem, i) => (i % size ? [] : [ array.slice(i, i + size) ])));


const columnsCount = 6;
const rows = buildRows(colors.sort((lhs, rhs) => getLuma(rhs.rgb) - getLuma(lhs.rgb)));

const table = `
<html>
<head></head>
<body>
<table>
	<thead>
		${[...Array(columnsCount).keys()].map(() => '<tr></tr>\n').join(' ')}
	</thead>
	<tbody>
		${bucketize(rows, columnsCount)
			.map(bucket => {
				return `<tr>\n${bucket.join('\n')}</tr>`
			}).join('\n')}
	</tbody>
</table>
</body>
</html>
`

nodeHtmlToImage({
  output: './imgs/pallete.png',
  html: table
})
  .then(() => console.log('The image was created successfully!'))
