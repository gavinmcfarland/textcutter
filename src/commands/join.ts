import { nodeInInstance } from '../utils/node-in-instance.js'
import { getUniqueFonts } from '../utils/get-unique-fonts.js'
import { applyFormattingRanges } from '../utils/apply-formatting-ranges.js'
import { getFormattingRanges } from '../utils/get-formatting-ranges.js'

/**
 * Join multiple text nodes into a single text node
 * @param withBreaks - Whether to join with line breaks
 * @returns A message indicating the number of layers joined
 */
export async function join(withBreaks: boolean = false): Promise<string> {
	// Filtering text layers from selection
	let list = figma.currentPage.selection
	let textlist = list.filter((node) => node.type == 'TEXT') as TextNode[]

	// Checking if there is enough layers to join
	if (textlist.length === 0) {
		return 'No text layers selected to join'
	}

	if (textlist.length < 2) {
		return 'Select at least 2 text layers to join'
	}

	// Font check
	if (textlist.find((node) => node.hasMissingFont)) {
		return 'Whoops, you need to have the font for all selected layers installed first.'
	}

	// Finding the top-leftmost one from selected text layers. It will be our "main" node, we will merge joined text content into it later.
	textlist.sort((a, b) => {
		if (
			(a.y === b.absoluteTransform[1][2] && a.absoluteTransform[0][2] < b.absoluteTransform[0][2]) ||
			a.absoluteTransform[1][2] < b.absoluteTransform[1][2]
		) {
			return -1
		}
		if (
			(a.absoluteTransform[1][2] === b.absoluteTransform[1][2] &&
				a.absoluteTransform[0][2] > b.absoluteTransform[0][2]) ||
			a.absoluteTransform[1][2] > b.absoluteTransform[1][2]
		) {
			return 1
		}
		return 0
	})

	let mainNode = textlist[0]

	// Checking if there is text layers placed in instance among the text nodes.
	if (textlist.filter((node) => nodeInInstance(node)).length > 0) {
		return "Can't join texts from the layers inside of the instance! Try joining texts in main component"
	}

	const uniqueFonts = await Promise.all(textlist.map((node) => getUniqueFonts(node)))
	const allUniqueFonts = Array.from(new Set(uniqueFonts.flat().map((font) => `${font.family},${font.style}`))).map(
		(fontString) => {
			const [family, style] = fontString.split(',')
			return { family, style } as FontName
		},
	)

	// Load all fonts asynchronously
	await Promise.all(allUniqueFonts.map((font) => figma.loadFontAsync(font)))

	let joinedText = ''
	let formattingRanges = []
	let currentOffset = 0

	for (let i = 0; i < textlist.length; i++) {
		const node = textlist[i]
		const nodeText = node.characters

		// Copy text from current node
		if (withBreaks) {
			joinedText += nodeText + (i < textlist.length - 1 ? '\n' : '')
		} else {
			joinedText += nodeText + (i < textlist.length - 1 ? ' ' : '')
		}

		// Get formatting ranges for this node
		const nodeRanges = getFormattingRanges(node, 0, nodeText.length)
		for (let j = 0; j < nodeRanges.length; j++) {
			const range = nodeRanges[j]
			formattingRanges.push({
				start: range.start + currentOffset,
				end: range.end + currentOffset,
				fontSize: range.fontSize,
				fontName: range.fontName,
				textCase: range.textCase,
				textDecoration: range.textDecoration,
				letterSpacing: range.letterSpacing,
				lineHeight: range.lineHeight,
				fills: range.fills,
				textStyleId: range.textStyleId,
				fillStyleId: range.fillStyleId,
			})
		}

		currentOffset += nodeText.length + (i < textlist.length - 1 ? 1 : 0) // Add 1 for space or newline
		// Remove the current node if it's not the main node
		if (i > 0) {
			node.remove()
		}
	}

	// Apply joined text to the main node
	mainNode.characters = joinedText
	mainNode.textAutoResize = 'WIDTH_AND_HEIGHT'

	// Apply formatting
	await applyFormattingRanges(mainNode, formattingRanges)

	// After the job is done showing confirmation with number of layers joined, then closing plugin
	return `Joined ${textlist.length} layers${withBreaks ? ' with line breaks' : ''}`
}
