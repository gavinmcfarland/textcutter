export function createTextNodes(array: string[]) {
	const textNodes: TextNode[] = []

	array.forEach((textNode) => {
		const text = figma.createText()
		text.characters = textNode
		textNodes.push(text)
	})

	return textNodes
}
