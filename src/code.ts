import { removeBullets } from './commands/remove-bullets.js'
import { splitWords } from './commands/split-words.js'
import { split } from './commands/split.js'
import { join } from './commands/join.js'
import { nodeInInstance } from './utils/node-in-instance.js'
import { getUniqueFonts } from './utils/get-unique-fonts.js'
import { loadFonts } from './utils/load-fonts.js'
import { applyFormattingRanges } from './utils/apply-formatting-ranges.js'
import { getFormattingRanges } from './utils/get-formatting-ranges.js'
// @author Johan Ronsse
// @version 3.0
// @description
//    Split and join text layers with lightweight noUI plugin

/*
  Example use case: when you put text through OCR, you end up with a long string,
  which you will probably want in separate layers in Figma to start building a UI.
  This plugin avoids the manual splitting of layers.
*/

export default async function () {
	console.clear()
	console.log('Starting plugin')

	console.log(process.env.NODE_ENV)

	if (process.env.NODE_ENV === 'test') {
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

	// if (message) {
	// 	figma.closePlugin(message)
	// }
}
