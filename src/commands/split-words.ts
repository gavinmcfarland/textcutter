import { nodeInInstance } from '../utils/node-in-instance.js'
import { getUniqueFonts } from '../utils/get-unique-fonts.js'
import { loadFonts } from '../utils/load-fonts.js'
import { applyFormattingRanges } from '../utils/apply-formatting-ranges.js'
import { getFormattingRanges } from '../utils/get-formatting-ranges.js'

/**
 * Split a text node into multiple text nodes, one for each word
 * @returns A message indicating the number of layers created
 */
export async function splitWords(): Promise<string> {
	// Checks and balances
	const singleTextNodeError = 'Select a single text node to split words.'
	if (figma.currentPage.selection.length !== 1) {
		return singleTextNodeError
	}

	const node = figma.currentPage.selection[0]
	if (node.type !== 'TEXT') {
		return singleTextNodeError
	}

	if (node.hasMissingFont) {
		return 'Oops, you need to have the font for this layer installed.'
	}

	if (nodeInInstance(node)) {
		return "Can't split words inside of a component instance. Try splitting words in main component."
	}

	let inputText = node.characters
	let nodeParent = node.parent

	// Split the text into words
	let words = inputText.split(/\s+/).filter(Boolean)

	if (words.length === 1) {
		return 'Nothing to split. There is only one word in the selected text layer.'
	}

	// Load fonts
	const uniqueFonts = await getUniqueFonts(node)
	await loadFonts(node, new Set(uniqueFonts.map((font) => JSON.stringify(font))))

	// Create new text nodes for each word
	const nodes: SceneNode[] = []
	let xOffset = 0

	for (let i = 0; i < words.length; i++) {
		const word = words[i]
		const startIndex = inputText.indexOf(word, i === 0 ? 0 : inputText.indexOf(words[i - 1]) + words[i - 1].length)
		const endIndex = startIndex + word.length

		const wordNode = figma.createText()
		wordNode.fontName = typeof node.fontName !== 'symbol' ? node.fontName : { family: 'Inter', style: 'Regular' }
		wordNode.characters = word

		wordNode.x = node.x + xOffset
		wordNode.y = node.y

		// Apply formatting
		const formattingRanges = getFormattingRanges(node, startIndex, endIndex)
		await applyFormattingRanges(wordNode, formattingRanges)

		wordNode.textAutoResize = 'WIDTH_AND_HEIGHT'

		// Calculate the width of the word node
		const wordWidth = wordNode.width

		// Add the word width to the offset
		xOffset += wordWidth

		if (i < words.length - 1) {
			const fontSize = wordNode.fontSize
			if (fontSize !== figma.mixed) {
				const spaceWidth = fontSize * 0.25 // Approximate space width
				xOffset += spaceWidth
			} else {
				// Handle mixed font sizes
				const averageFontSize = 16 // You might want to calculate this based on your specific needs
				const spaceWidth = averageFontSize * 0.25
				xOffset += spaceWidth
			}
		}

		nodeParent.appendChild(wordNode)
		nodes.push(wordNode)
	}

	// Remove the original node
	node.remove()

	// Select newly created nodes
	figma.currentPage.selection = nodes

	return `Split text into ${nodes.length} words`
}
