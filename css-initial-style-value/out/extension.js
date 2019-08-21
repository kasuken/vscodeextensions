"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const InitialValues = require("./properties.json");
const propertyValues = InitialValues;
function activate(context) {
    const initialValuesHoverProvider = {
        provideHover(doc, pos) {
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
    let disposable = vscode.languages.registerHoverProvider([
        { scheme: 'file', language: 'css' },
        { scheme: 'file', language: 'less' },
        { scheme: 'file', language: 'sass' },
        { scheme: 'file', language: 'scss' }
    ], initialValuesHoverProvider);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getInitialValue(word) {
    return propertyValues[word.substring(0, word.length - 1)].initial;
}
function getMdnUrl(word) {
    return propertyValues[word.substring(0, word.length - 1)].mdn_url;
}
function buildHoverText(initialValue, mdnUrl) {
    let value = '';
    if (Array.isArray(initialValue)) {
        const properties = initialValue.map(item => {
            return `- ${item}: \`${propertyValues[item].initial}\``;
        });
        value = `
Initial value for each properties:

${properties.join('\n')}
`;
    }
    else {
        value = `Initial value: \`${initialValue}\``;
    }
    value = value + `\n\n [Read More on MDN]:(${mdnUrl}`;
    return new vscode.MarkdownString(value);
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map