import { test } from 'plugma/vitest'
import { removeBullets } from '../src/commands/removeBullets.js'
import { BaseTestCase, runTextCommandTest } from './utils/test-utils.js'

const TEST_CASES: BaseTestCase[] = [
	{
		name: 'simple bullets',
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

console.clear()

// Run all test cases
TEST_CASES.forEach((testCase) => {
	test(`remove bullets: ${testCase.name}`, async () => {
		await runTextCommandTest(testCase, removeBullets)
	})
})
