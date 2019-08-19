import * as vscode from 'vscode';
import * as InitialValues from "./properties.json";

interface CssProperty {
	syntax: string;
	media: string | string[];
	inherited: boolean;
	animationType: string | string[];
	percentages: string | string[];
	groups: string[];
	initial: string | string[];
	appliesto: string;
	computed: string | string[];
	order: string;
	status: string;
	mdn_url?: string;
}

const propertyValues: { [key: string]: CssProperty } = InitialValues;

export function activate(context: vscode.ExtensionContext) {
	
	const initialValuesHoverProvider: vscode.HoverProvider = {
		provideHover(doc, pos): vscode.ProviderResult<vscode.Hover> {
			const range = doc.getWordRangeAtPosition(pos, /[a-z\-]+:/ig);

			if (range === undefined) {
				return;
			}

			const initialValue = getInitialValue(doc.getText(range));
			const mdnUrl = getMdnUrl(doc.getText(range));

			if (initialValue === undefined) {
				return;
			}

			return new vscode.Hover(buildHoverText(initialValue, mdnUrl));
		}
	};

	let disposable = vscode.languages.registerHoverProvider(
		[
			{ scheme: 'file', language: 'css' },
			{ scheme: 'file', language: 'less' },
			{ scheme: 'file', language: 'sass' },
			{ scheme: 'file', language: 'scss' }
		],
		initialValuesHoverProvider
	);

	context.subscriptions.push(disposable);
}

function getInitialValue(word: string): string | string[] {
	return propertyValues[word.substring(0, word.length - 1)].initial;
}

function getMdnUrl(word: string): string | undefined {
	return propertyValues[word.substring(0, word.length - 1)].mdn_url;
}

function buildHoverText(initialValue: string | string[], mdnUrl: string | undefined): vscode.MarkdownString {
	let value = '';

	if (Array.isArray(initialValue)) {
		const properties = initialValue.map(item => {
			return `- ${item}: \`${propertyValues[item].initial}\``;
		});

		value = `
Initial value for each properties:

${properties.join('\n')}
`;
	} else {
		value = `Initial value: \`${initialValue}\``;
	}

	value = value + `\n\n More info: \`${mdnUrl}\``;

	return new vscode.MarkdownString(value);
}

export function deactivate() { }