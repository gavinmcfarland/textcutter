import { getUniqueFonts } from '../utils/get-unique-fonts.js'
import { loadFonts } from '../utils/load-fonts.js'
import { reapplyFormatting } from '../utils/reapply-formatting.js'

/**
 * Remove bullets from selected text layers
 * @returns A message indicating the number of layers removed
 */
export async function removeBullets() {
	// REMOVE BULLETS COMMAND
	const selectedNodes = figma.currentPage.selection.filter((node) => node.type === 'TEXT') as TextNode[]

	if (selectedNodes.length === 0) {
		return 'No text layers selected. Please select at least one text layer.'
	}

	let bulletCount = 0

	// Load fonts for all selected nodes
	const uniqueFonts = new Set<string>()
	for (const node of selectedNodes) {
		const nodeFonts = await getUniqueFonts(node)
		for (const font of nodeFonts) {
			uniqueFonts.add(JSON.stringify(font))
		}
	}
	await loadFonts(selectedNodes[0], uniqueFonts)

	for (const node of selectedNodes) {
		let textChanged = false
		const lines = node.characters.split('\n')
		let newLines = []
		let currentIndex = 0

		for (const line of lines) {
			const lineLength = line.length

			if (lineLength === 0) {
				newLines.push(line)
				currentIndex += 1 // Only add 1 for the newline character
				continue
			}

			const listOptions = node.getRangeListOptions(currentIndex, currentIndex + lineLength)

			// Check for Figma-created bullets
			if (listOptions !== figma.mixed && listOptions && listOptions.type === 'UNORDERED') {
				node.setRangeListOptions(currentIndex, currentIndex + lineLength, {
					type: 'NONE',
				})
				textChanged = true
			}

			// Check for character-based bullets
			const bulletRegex = /^[•·∙‣⁃◦⦿⦾■□▪▫●○◉◎◈◇◆★☆✦✧✱✲✳✴✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋]\s?/
			if (bulletRegex.test(line)) {
				newLines.push(line.replace(bulletRegex, '').trim())
				textChanged = true
			} else {
				newLines.push(line)
			}

			currentIndex += lineLength + 1 // +1 for the newline character
		}

		if (textChanged) {
			node.characters = newLines.join('\n')
			await reapplyFormatting(node)
			bulletCount++
		}
	}
	return `Removed bullets from ${bulletCount} out of ${selectedNodes.length} selected text layers.`
}
