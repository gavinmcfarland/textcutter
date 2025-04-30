import { test } from 'plugma/vitest'
import { split } from '../src/commands/split.js'
import { BaseTestCase, runTextCommandTest } from './utils/test-utils.js'

const TEST_CASES: BaseTestCase[] = [
	{
		name: 'simple paragraph split',
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
		name: 'single line of text',
		input: [`Testing single line of text`],
		expected: ['Testing single line of text'],
	},
]

console.clear()

TEST_CASES.forEach((testCase) => {
	test(`split text: ${testCase.name}`, async () => {
		await runTextCommandTest(testCase, split)
	})
})
