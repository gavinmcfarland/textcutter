import { getUniqueFonts } from './get-unique-fonts.js'
export async function loadFonts(node: TextNode, uniqueFonts: Set<string>): Promise<void> {
	const fonts = Array.from(uniqueFonts).map((fontString) => JSON.parse(fontString) as FontName)
	await Promise.all(fonts.map((font) => figma.loadFontAsync(font)))

	if (typeof node.fontName !== 'symbol') {
		await figma.loadFontAsync(node.fontName)
	} else {
		console.log('Mixed fonts detected. Loading all fonts used in the text node.')
		const nodeFonts = await getUniqueFonts(node)
		await Promise.all(nodeFonts.map((font) => figma.loadFontAsync(font)))
	}
}
