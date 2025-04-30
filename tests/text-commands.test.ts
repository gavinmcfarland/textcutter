import { expect, test } from 'plugma/vitest'
import { join } from '../src/commands/join.js'
import { split } from '../src/commands/split.js'
import { splitWords } from '../src/commands/split-words.js'
import { removeBullets } from '../src/commands/remove-bullets.js'
import { BaseTestCase, runTextCommandTest } from './utils/test-utils.js'
import { createTextNodes } from './mocks/create-text-nodes.js'

interface ExtendedTestCase extends BaseTestCase {
	command: 'join' | 'split' | 'splitWords' | 'removeBullets'
	parameters?: {
		withBreaks?: boolean
	}
}

const TEST_CASES: ExtendedTestCase[] = [
	// Join text test cases
	{
		command: 'join',
		name: 'join lines of text into a single line of text',
		input: [
			'The orange cat jumped over the old wooden fence with grace.',
			'By the riverbank, the mist rose slowly, touching the tips of the trees.',
			'She found a hidden key under a pile of forgotten maps and old coins.',
			'The clock struck midnight, signaling the beginning of an unexpected adventure.',
		],
		expected: [
			'The orange cat jumped over the old wooden fence with grace. By the riverbank, the mist rose slowly, touching the tips of the trees. She found a hidden key under a pile of forgotten maps and old coins. The clock struck midnight, signaling the beginning of an unexpected adventure.',
		],
	},
	{
		command: 'join',
		name: 'join lines of text into a block of text',
		parameters: {
			withBreaks: true,
		},
		input: [
			'The orange cat jumped over the old wooden fence with grace.',
			'By the riverbank, the mist rose slowly, touching the tips of the trees.',
			'She found a hidden key under a pile of forgotten maps and old coins.',
			'The clock struck midnight, signaling the beginning of an unexpected adventure.',
		],
		expected: [
			`The orange cat jumped over the old wooden fence with grace.\nBy the riverbank, the mist rose slowly, touching the tips of the trees.\nShe found a hidden key under a pile of forgotten maps and old coins.\nThe clock struck midnight, signaling the beginning of an unexpected adventure.`,
		],
	},

	// Split text test cases
	{
		command: 'split',
		name: 'split block of text into lines of text',
		input: [
			`The orange cat jumped over the old wooden fence with grace.
By the riverbank, the mist rose slowly, touching the tips of the trees.
She found a hidden key under a pile of forgotten maps and old coins.
The clock struck midnight, signaling the beginning of an unexpected adventure.`,
		],
		expected: [
			'The orange cat jumped over the old wooden fence with grace.',
			'By the riverbank, the mist rose slowly, touching the tips of the trees.',
			'She found a hidden key under a pile of forgotten maps and old coins.',
			'The clock struck midnight, signaling the beginning of an unexpected adventure.',
		],
	},
	{
		command: 'split',
		name: 'split single line of text',
		input: [`Testing single line of text`],
		expected: ['Testing single line of text'],
	},

	// Split words test cases
	{
		command: 'splitWords',
		name: 'split line of text into words',
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

	// Remove bullets test cases
	{
		command: 'removeBullets',
		name: 'remove bullets from a block of text',
		input: [
			`• The orange cat jumped over the old wooden fence with grace.
• By the riverbank, the mist rose slowly, touching the tips of the trees.
• She found a hidden key under a pile of forgotten maps and old coins.
• The clock struck midnight, signaling the beginning of an unexpected adventure.`,
		],
		expected: [
			`The orange cat jumped over the old wooden fence with grace.
By the riverbank, the mist rose slowly, touching the tips of the trees.
She found a hidden key under a pile of forgotten maps and old coins.
The clock struck midnight, signaling the beginning of an unexpected adventure.`,
		],
	},
]

// Helper function to run the appropriate command based on the test case
async function runCommand(testCase: ExtendedTestCase) {
	switch (testCase.command) {
		case 'join':
			return runTextCommandTest(testCase, (params) => join(params?.withBreaks))
		case 'split':
			return runTextCommandTest(testCase, split)
		case 'splitWords':
			// Clear the page
			figma.currentPage.children.forEach((node) => node.remove())

			// Load fonts
			await Promise.all([
				figma.loadFontAsync({
					family: 'Inter',
					style: 'Regular',
				}),
			])

			const textNodes = createTextNodes(testCase.input)
			figma.currentPage.selection = textNodes

			await splitWords()

			const selection = figma.currentPage.children

			// Check that we have the correct number of text nodes after splitting
			expect(selection.length).toBe(testCase.expected.length)

			// Verify each text node has the correct content
			selection.forEach((node, index) => {
				expect(node.type).toBe('TEXT')
				expect((node as TextNode).characters).toBe(testCase.expected[index])
			})
			break
		case 'removeBullets':
			return runTextCommandTest(testCase, removeBullets)
	}
}

// Run all test cases
TEST_CASES.forEach((testCase) => {
	test(`${testCase.name} `, async () => {
		await runCommand(testCase)
	})
})
