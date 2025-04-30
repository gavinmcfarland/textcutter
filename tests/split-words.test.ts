import { expect, test } from 'plugma/vitest'
import { createTextNodes } from './mocks/createTextNodes.js'
import { split } from '../src/commands/split.js'
import { splitWords } from '../src/commands/splitWords.js'
import { BaseTestCase } from './utils/test-utils.js'

const TEST_CASES: BaseTestCase[] = [
	{
		name: 'Split line of text into words',
		input: [`This is an example of a line of text that we want to split into words.`],
		expected: [
			'This',
			'is',
			'an',
			'example',
			'of',
			'a',
			'line',
			'of',
			'text',
			'that',
			'we',
			'want',
			'to',
			'split',
			'into',
			'words.',
		],
	},
]

console.clear()

TEST_CASES.forEach((testCase) => {
	test(`split text: ${testCase.name}`, async () => {
		// Clear the page

		figma.currentPage.children.forEach((node) => {
			node.remove()
		})
		console.log('Cleared the page')

		// Load fonts
		await Promise.all([
			figma.loadFontAsync({
				family: 'Inter',
				style: 'Regular',
			}),
		])
		console.log('Loaded fonts')

		const textNodes = createTextNodes(testCase.input)
		console.log('Created text nodes', textNodes)

		figma.currentPage.selection = textNodes
		console.log('Set selection', figma.currentPage.selection)

		await splitWords()
		console.log('Split text into words')

		const selection = figma.currentPage.children
		console.log('Got selection', selection)

		// Check that we have the correct number of text nodes after splitting
		expect(selection.length).toBe(testCase.expected.length)

		// Verify each text node has the correct content
		selection.forEach((node, index) => {
			expect(node.type).toBe('TEXT')
			expect((node as TextNode).characters).toBe(testCase.expected[index])
		})
	})
})
