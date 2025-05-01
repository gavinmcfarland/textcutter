import { expect, test } from 'plugma/vitest'
import { join } from '../src/commands/join.js'
import { split } from '../src/commands/split.js'
import { splitWords } from '../src/commands/split-words.js'
import { removeBullets } from '../src/commands/remove-bullets.js'
import { BaseTestCase, runTextCommandTest } from './utils/test-utils.js'

// Replace individual imports with dynamic directory import
const testFixtures = import.meta.glob('./fixtures/*.json', {
	import: 'default',
	eager: true,
})

// Convert the object of fixtures into an array of test cases
const allTestCases: ExtendedTestCase[] = Object.values(testFixtures)

interface ExtendedTestCase extends BaseTestCase {
	command: 'join' | 'split' | 'splitWords' | 'removeBullets'
	parameters?: {
		withBreaks?: boolean
	}
}

// Helper function to run the appropriate command based on the test case
async function runCommand(testCase: ExtendedTestCase) {
	switch (testCase.command) {
		case 'join':
			return runTextCommandTest(testCase, (params) => join(params?.withBreaks))
		case 'split':
			return runTextCommandTest(testCase, split)
		case 'splitWords':
			return runTextCommandTest(testCase, splitWords)
		case 'removeBullets':
			return runTextCommandTest(testCase, removeBullets)
	}
}

// Run all test cases from fixtures
allTestCases.forEach((testCase) => {
	test(`${testCase.name}`, async () => {
		await runCommand(testCase as ExtendedTestCase)
	})
})
