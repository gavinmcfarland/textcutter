// Helper function to reapply formatting after bullet removal
export async function reapplyFormatting(node: TextNode) {
	const length = node.characters.length

	// Reapply font
	const fontName = node.getRangeFontName(0, 1)
	if (typeof fontName !== 'symbol') {
		await figma.loadFontAsync(fontName)
		node.setRangeFontName(0, length, fontName)
	}

	// Reapply font size
	const fontSize = node.getRangeFontSize(0, 1)
	if (typeof fontSize === 'number') {
		node.setRangeFontSize(0, length, fontSize)
	}

	// Reapply other text properties
	const textDecoration = node.getRangeTextDecoration(0, 1)
	if (textDecoration !== figma.mixed) {
		node.setRangeTextDecoration(0, length, textDecoration)
	}

	const textCase = node.getRangeTextCase(0, 1)
	if (textCase !== figma.mixed) {
		node.setRangeTextCase(0, length, textCase)
	}

	const letterSpacing = node.getRangeLetterSpacing(0, 1)
	if (letterSpacing !== figma.mixed) {
		node.setRangeLetterSpacing(0, length, letterSpacing)
	}

	const lineHeight = node.getRangeLineHeight(0, 1)
	if (lineHeight !== figma.mixed) {
		node.setRangeLineHeight(0, length, lineHeight)
	}

	const fills = node.getRangeFills(0, 1)
	if (fills !== figma.mixed) {
		node.setRangeFills(0, length, fills)
	}

	// Reapply text and fill styles if they exist
	const textStyleId = node.getRangeTextStyleId(0, 1)
	if (typeof textStyleId === 'string') {
		await node.setRangeTextStyleIdAsync(0, length, textStyleId)
	}

	const fillStyleId = node.getRangeFillStyleId(0, 1)
	if (typeof fillStyleId === 'string') {
		await node.setRangeFillStyleIdAsync(0, length, fillStyleId)
	}
}
