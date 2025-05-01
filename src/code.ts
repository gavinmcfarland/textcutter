import { removeBullets } from './commands/remove-bullets.js'
import { splitWords } from './commands/split-words.js'
import { split } from './commands/split.js'
import { join } from './commands/join.js'

export default async function () {
	// Only show during testing
	if (process.env.NODE_ENV === 'test') {
		console.clear()
		figma.showUI(__html__, { themeColors: true })
	}

	let message = ''

	switch (figma.command) {
		case 'removeBullets':
			message = await removeBullets()
			break
		case 'splitWords':
			message = await splitWords()
			break
		case 'split':
			message = await split()
			break
		case 'join':
		case 'joinWithBreaks':
			message = await join(figma.command === 'joinWithBreaks')
	}

	// Don't close during testing
	if (process.env.NODE_ENV !== 'test') {
		if (message) {
			figma.closePlugin(message)
		}
	}
}
