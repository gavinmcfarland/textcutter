import { test } from 'plugma/vitest'
import { join } from '../src/commands/join.js'
import { BaseTestCase, runTextCommandTest } from './utils/test-utils.js'

interface JoinTestCase extends BaseTestCase {
	parameters?: {
		withBreaks: boolean
	}
}

const TEST_CASES: JoinTestCase[] = [
	{
		name: 'separate lines of text',
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
		name: 'separate lines of text with breaks',
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
]

TEST_CASES.forEach((testCase) => {
	test(`join text: ${testCase.name}`, async () => {
		await runTextCommandTest(testCase, (params) => join(params?.withBreaks))
	})
})
