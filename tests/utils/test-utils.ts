import { expect } from 'plugma/vitest'
import { createTextNodes } from '../mocks/create-text-nodes.js'

export interface BaseTestCase {
	name: string
	input: string[]
	expected: string[]
	parameters?: Record<string, any>
}

export async function runTextCommandTest<T extends BaseTestCase>(
	testCase: T,
	commandFn: (params?: any) => Promise<any>,
) {
	// Clear the page
	figma.currentPage.children.forEach((node) => {
		node.remove()
	})

	// Load fonts
	await Promise.all([
		figma.loadFontAsync({
			family: 'Inter',
			style: 'Regular',
		}),
	])

	const textNodes = createTextNodes(testCase.input)
	figma.currentPage.selection = textNodes

	// Execute the command with parameters if they exist
	if (testCase.parameters) {
		await commandFn(testCase.parameters)
	} else {
		await commandFn()
	}

	const selection = figma.currentPage.children

	// Check that we have the correct number of text nodes after operation
	expect(selection.length).toBe(testCase.expected.length)

	// Verify each text node has the correct content
	selection.forEach((node, index) => {
		expect(node.type).toBe('TEXT')
		expect((node as TextNode).characters).toBe(testCase.expected[index])
	})
}
