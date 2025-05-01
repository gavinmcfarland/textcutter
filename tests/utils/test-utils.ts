import { expect } from 'plugma/vitest'
import { createTextNodes } from '../mocks/create-text-nodes.js'

export interface BaseTestCase {
	command: string
	name: string
	input: string[]
	expected: string[]
	parameters?: Record<string, any>
}

export async function runTextCommandTest<T extends BaseTestCase>(
	testCase: T,
	commandFn: (params?: any) => Promise<any>,
) {
	figma.currentPage.children.forEach((node) => {
		node.remove()
	})
	console.log('Cleared page')

	// Load fonts
	await Promise.all([
		figma.loadFontAsync({
			family: 'Inter',
			style: 'Regular',
		}),
	])

	const textNodes = createTextNodes(testCase.input)
	console.log('Created text nodes')
	figma.currentPage.selection = textNodes
	console.log('Set selection')
	// Execute the command with parameters if they exist
	if (testCase.parameters) {
		await commandFn(testCase.parameters)
	} else {
		await commandFn()
	}
	console.log('Executed command', testCase.command)

	const selection = figma.currentPage.children
	console.log('Got selection')
	// Check that we have the correct number of text nodes after operation
	expect(selection.length).toBe(testCase.expected.length)

	// Verify each text node has the correct content
	selection.forEach((node, index) => {
		expect(node.type).toBe('TEXT')
		expect((node as TextNode).characters).toBe(testCase.expected[index])
	})
}
