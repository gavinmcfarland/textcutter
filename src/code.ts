import { removeBullets } from './commands/removeBullets.js'
import { splitWords } from './commands/splitWords.js'
import { split } from './commands/split.js'
import { join } from './commands/join.js'
import { nodeInInstance } from './utils/nodeInInstance.js'
import { getUniqueFonts } from './utils/getUniqueFonts.js'
import { loadFonts } from './utils/loadFonts.js'
import { applyFormattingRanges } from './utils/applyFormattingRanges.js'
import { getFormattingRanges } from './utils/getFormattingRanges.js'
// @author Johan Ronsse
// @version 3.0
// @description
//    Split and join text layers with lightweight noUI plugin

/*
  Example use case: when you put text through OCR, you end up with a long string,
  which you will probably want in separate layers in Figma to start building a UI.
  This plugin avoids the manual splitting of layers.
*/

async function main(): Promise<string | undefined> {
	switch (figma.command) {
		case 'removeBullets':
			return await removeBullets()
		case 'splitWords':
			return await splitWords()
		case 'split':
			return await split()
		case 'join':
		case 'joinWithBreaks':
			return await join(figma.command === 'joinWithBreaks')
	}
}

export default function () {
	main().then((message: string | undefined) => {
		console.clear()
		console.log('Starting plugin')
		figma.showUI(__html__, { themeColors: true })
		// figma.closePlugin(message)
	})
}
