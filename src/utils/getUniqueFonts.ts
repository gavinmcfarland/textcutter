export async function getUniqueFonts(node: TextNode): Promise<FontName[]> {
	const uniqueFonts: Set<string> = new Set()
	for (let i = 0; i < node.characters.length; i++) {
		const font = node.getRangeFontName(i, i + 1)
		uniqueFonts.add(JSON.stringify(font))
	}
	return Array.from(uniqueFonts).map((font) => JSON.parse(font) as FontName)
}
