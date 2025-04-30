export function getFormattingRanges(textNode: TextNode, startOffset: number, endOffset: number) {
	const ranges = []
	const length = endOffset - startOffset

	for (let i = 0; i < length; i++) {
		const originalIndex = startOffset + i
		ranges.push({
			start: i,
			end: i + 1,
			fontSize: textNode.getRangeFontSize(originalIndex, originalIndex + 1),
			fontName: textNode.getRangeFontName(originalIndex, originalIndex + 1),
			textCase: textNode.getRangeTextCase(originalIndex, originalIndex + 1),
			textDecoration: textNode.getRangeTextDecoration(originalIndex, originalIndex + 1),
			letterSpacing: textNode.getRangeLetterSpacing(originalIndex, originalIndex + 1),
			lineHeight: textNode.getRangeLineHeight(originalIndex, originalIndex + 1),
			fills: textNode.getRangeFills(originalIndex, originalIndex + 1),
			textStyleId: textNode.getRangeTextStyleId(originalIndex, originalIndex + 1),
			fillStyleId: textNode.getRangeFillStyleId(originalIndex, originalIndex + 1),
		})
	}

	return ranges
}
