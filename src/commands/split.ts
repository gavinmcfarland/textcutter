import { nodeInInstance } from '../utils/node-in-instance.js'
import { loadFonts } from '../utils/load-fonts.js'
import { applyFormattingRanges } from '../utils/apply-formatting-ranges.js'
import { getFormattingRanges } from '../utils/get-formatting-ranges.js'

/**
 * Split text nodes into multiple lines of text nodes
 * @returns A message indicating the number of layers created
 */
export async function split(): Promise<string> {
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

		// Get the characters and parent
		let inputText = node.characters
		let nodeParent = node.parent

		// Split into lines
		let result = inputText.split(/\r\n|\n\r|\r|\n|\u2028|\u2029/)

		// Remove trailing empty lines
		while (result.length > 0 && result[result.length - 1].trim() === '') {
			result.pop()
		}
		while (result.length > 0 && result[0].trim() === '') {
			result.shift()
		}

		let filteredResults = result.map((s) => s.trimEnd())

		// Skip if only one line
		if (filteredResults.length === 1) {
			continue
		}

		// Scan styles and prepare formatting information
		let formattingInfo = []
		let uniqueFonts = new Set<string>()

		for (let i = 0; i < filteredResults.length; i++) {
			const line = filteredResults[i]
			const startIndex = inputText.indexOf(line)
			const endIndex = startIndex + line.length

			const lineFormatting = getFormattingRanges(node, startIndex, endIndex)
			formattingInfo.push(lineFormatting)

			lineFormatting.forEach((range) => {
				if (typeof range.fontName !== 'symbol') {
					uniqueFonts.add(JSON.stringify(range.fontName))
				}
			})
		}

		// Load fonts
		await loadFonts(node, uniqueFonts)

		const nodes: SceneNode[] = []
		let vshift = 0

		// Create new text nodes for each line
		for (let i = 0; i < filteredResults.length; i++) {
			const line = figma.createText()
			line.fontName = typeof node.fontName !== 'symbol' ? node.fontName : { family: 'Inter', style: 'Regular' }
			line.characters = filteredResults[i]

			line.x = node.x
			line.y = node.y + vshift

			await applyFormattingRanges(line, formattingInfo[i])

			line.textAutoResize = 'WIDTH_AND_HEIGHT'

			vshift += line.height
			if (filteredResults[i].trim() === '' && i < filteredResults.length - 1) {
				vshift += line.height
			}

			nodeParent.appendChild(line)
			nodes.push(line)
		}

		// Remove original node and track new nodes
		node.remove()
		allNewNodes.push(...nodes)
		totalNewNodes += nodes.length
	}

	// Select all new nodes
	if (allNewNodes.length > 0) {
		figma.currentPage.selection = allNewNodes
		return `Split text into ${totalNewNodes} layers from ${textNodes.length} text nodes`
	}

	return 'No text nodes were split. Make sure selected text nodes have multiple lines.'
}
