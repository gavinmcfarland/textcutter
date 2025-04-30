import { nodeInInstance } from '../utils/node-in-instance.js'
import { loadFonts } from '../utils/load-fonts.js'
import { applyFormattingRanges } from '../utils/apply-formatting-ranges.js'
import { getFormattingRanges } from '../utils/get-formatting-ranges.js'

/**
 * Split a text node into multiple lines of text nodes
 * @returns A message indicating the number of layers created
 */
export async function split(): Promise<string> {
	// First, some checks and balances common for both commands
	const singleTextNodeError = 'Select a single text node to split text.'
	// Make sure the selection is a single piece of text before proceeding.
	if (figma.currentPage.selection.length !== 1) {
		return singleTextNodeError
	}

	// Make sure we are dealing with a single text node
	const node = figma.currentPage.selection[0]

	if (node.type !== 'TEXT') {
		return singleTextNodeError
	}

	// Font check
	if (node.hasMissingFont) {
		return 'Oops, you need to have the font for this layer installed.'
	}

	if (nodeInInstance(node)) {
		return "Can't split texts inside of a component instance. Try splitting text in main component."
	}

	// We get the characters from our current selected layer, and parent to put individual lines in it later
	let inputText = node.characters
	let nodeParent = node.parent

	// This regex splits multiline string into multiple lines and puts it in an array
	// Potentially U+2029 (\u2029): Paragraph Separator and U+0085 (\u0085): Next Line could be added to the regex
	let result = inputText.split(/[\r\n\u2028]/)

	// Remove only trailing empty lines, keep empty lines in between
	while (result.length > 0 && result[result.length - 1].trim() === '') {
		result.pop()
	}
	while (result.length > 0 && result[0].trim() === '') {
		result.shift()
	}

	let filteredResults = result.map((s) => s.trimEnd())

	// Checking if there is just one line in array, in that case doing nothing so original stays in place
	if (filteredResults.length === 1) {
		return 'Nothing to split. There is only one line in the selected text layer. Please select multi-line text to split it.'
	}

	// Scan styles and prepare formatting information before creating new text nodes
	let formattingInfo = []
	let uniqueFonts = new Set<string>()

	for (let i = 0; i < filteredResults.length; i++) {
		const line = filteredResults[i]
		const startIndex = inputText.indexOf(line)
		const endIndex = startIndex + line.length

		const lineFormatting = getFormattingRanges(node, startIndex, endIndex)
		formattingInfo.push(lineFormatting)

		// Collect unique fonts
		lineFormatting.forEach((range) => {
			if (typeof range.fontName !== 'symbol') {
				uniqueFonts.add(JSON.stringify(range.fontName))
			}
		})
	}

	// Load all fonts
	await loadFonts(node, uniqueFonts)

	// Now we need to make text layers that contain the text content of each of the array items
	const nodes: SceneNode[] = []

	// Offset to position lines correctly
	let vshift = 0

	// For each new line in array we create a new text node, populate it with line content, and place it after the previous one
	for (let i = 0; i < filteredResults.length; i++) {
		const line = figma.createText()
		line.fontName = typeof node.fontName !== 'symbol' ? node.fontName : { family: 'Inter', style: 'Regular' }
		line.characters = filteredResults[i]

		line.x = node.x
		line.y = node.y + vshift

		// Apply formatting ranges to the new line
		await applyFormattingRanges(line, formattingInfo[i])

		line.textAutoResize = 'WIDTH_AND_HEIGHT'

		// Adjust vshift based on line height and add extra space for empty lines
		vshift += line.height
		if (filteredResults[i].trim() === '' && i < filteredResults.length - 1) {
			vshift += line.height // Add an extra line height for empty lines
		}

		nodeParent.appendChild(line)
		nodes.push(line)
	}

	// After all separate line nodes have been created, the original one is being deleted
	node.remove()

	// Selecting newly created list of layers. Layers are not grouped so can be immediately put in frame, autolayout or just moved separately
	figma.currentPage.selection = nodes

	// After job is done showing confirmation with number of layers created, and closing plugin
	return `Split text into ${nodes.length} layers`
}
