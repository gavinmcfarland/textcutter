import { nodeInInstance } from '../utils/node-in-instance.js'
import { getUniqueFonts } from '../utils/get-unique-fonts.js'
import { loadFonts } from '../utils/load-fonts.js'
import { applyFormattingRanges } from '../utils/apply-formatting-ranges.js'
import { getFormattingRanges } from '../utils/get-formatting-ranges.js'

/**
 * Split text nodes into multiple text nodes, one for each word
 * @returns A message indicating the number of layers created
 */
export async function splitWords(): Promise<string> {
	const selection = figma.currentPage.selection
	if (selection.length === 0) {
		return 'Please select at least one text node to split.'
	}

	// Filter for text nodes only
	const textNodes = selection.filter((node): node is TextNode => node.type === 'TEXT')
	if (textNodes.length === 0) {
		return 'Please select at least one text node to split.'
	}

	// Track nodes with issues
	const nodesWithIssues = textNodes.filter((node) => node.hasMissingFont || nodeInInstance(node))
	if (nodesWithIssues.length === textNodes.length) {
		return 'None of the selected text nodes can be split. Check for missing fonts or nodes inside component instances.'
	}

	let totalNewNodes = 0
	const allNewNodes: SceneNode[] = []

	// Process each valid text node
	for (const node of textNodes) {
		// Skip nodes with issues
		if (node.hasMissingFont) {
			continue
		}
		if (nodeInInstance(node)) {
			continue
		}

		let inputText = node.characters
		let nodeParent = node.parent

		// Split the text into words
		let words = inputText.split(/\s+/).filter(Boolean)

		// Skip if only one word
		if (words.length === 1) {
			continue
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

		// Remove original node and track new nodes
		node.remove()
		allNewNodes.push(...nodes)
		totalNewNodes += nodes.length
	}

	// Select all new nodes
	if (allNewNodes.length > 0) {
		figma.currentPage.selection = allNewNodes
		return `Split text into ${totalNewNodes} words from ${textNodes.length} text nodes`
	}

	return 'No text nodes were split. Make sure selected text nodes have multiple words.'
}
