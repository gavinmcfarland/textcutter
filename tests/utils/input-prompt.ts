interface Question {
	id: string
	label: string
	options: {
		value: string | boolean
		label: string
	}[]
}

interface InputPromptResult {
	[key: string]: string // Maps question id to selected value
}

/**
 * Displays a UI prompt with a series of questions and returns the user's selections.
 *
 * @example
 * ```typescript
 * const questions = [
 *   {
 *     id: "color",
 *     label: "Select a color",
 *     options: [
 *       { value: "red", label: "Red" },
 *       { value: "blue", label: "Blue" },
 *       { value: "green", label: "Green" }
 *     ]
 *   },
 *   {
 *     id: "isBold",
 *     label: "Make text bold?",
 *     options: [
 *       { value: true, label: "Yes" },
 *       { value: false, label: "No" }
 *     ]
 *   }
 * ];
 *
 * const result = await inputPrompt(questions, testCase);
 * // result will be: { color: "red", isBold: true }
 * ```
 *
 * @param questions - Array of questions to display in the prompt
 * @param testCase - The test case being run
 * @returns Promise that resolves to an object mapping question IDs to their selected values
 */
export async function inputPrompt(questions: Question[]): Promise<InputPromptResult> {
	// Generate HTML for all questions
	const questionsHtml = questions
		.map((question) => {
			const optionsHtml = question.options.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join('\n')

			return `
				<div class="question">
					<h3>${question.label}:</h3>
					<select id="${question.id}-select">
						${optionsHtml}
					</select>
				</div>
			`
		})
		.join('\n')

	figma.showUI(
		`
		<div id="choice-container">
			${questionsHtml}
			<button id="submit">Submit</button>
		</div>
		<script>
			document.getElementById('submit').onclick = () => {
				const results = {};
				${questions
					.map(
						(q) => `
					const value = document.getElementById('${q.id}-select').value;
					results['${q.id}'] = value === 'true' ? true : value === 'false' ? false : value;
				`,
					)
					.join('\n')}
				parent.postMessage({ pluginMessage: { type: 'choice-selected', results } }, '*');
			}
		</script>
		`,
	)

	// Create a promise that resolves when the choices are made
	const choicePromise = new Promise<InputPromptResult>((resolve) => {
		figma.ui.onmessage = (msg) => {
			if (msg.type === 'choice-selected') {
				// Show confirmation UI
				// figma.showUI(`
				// 	<div>
				// 		<p>Selections made:</p>
				// 		${Object.entries(msg.results)
				// 			.map(([id, value]) => `<p>${id}: ${value}</p>`)
				// 			.join('\n')}
				// 	</div>
				// `)
				resolve(msg.results)
			}
		}
	})

	const result = await choicePromise

	figma.showUI(__html__)

	return result
}
