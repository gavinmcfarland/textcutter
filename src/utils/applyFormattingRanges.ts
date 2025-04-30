// Helper function to apply formatting ranges to a text node
export async function applyFormattingRanges(textNode: TextNode, ranges: any[]) {
	for (const range of ranges) {
		textNode.setRangeFontSize(range.start, range.end, range.fontSize)
		textNode.setRangeFontName(range.start, range.end, range.fontName)
		textNode.setRangeTextCase(range.start, range.end, range.textCase)
		textNode.setRangeTextDecoration(range.start, range.end, range.textDecoration)
		textNode.setRangeLetterSpacing(range.start, range.end, range.letterSpacing)
		textNode.setRangeLineHeight(range.start, range.end, range.lineHeight)
		textNode.setRangeFills(range.start, range.end, range.fills)
		textNode.setRangeTextStyleIdAsync(range.start, range.end, range.textStyleId)
		textNode.setRangeFillStyleIdAsync(range.start, range.end, range.fillStyleId)
	}
}
