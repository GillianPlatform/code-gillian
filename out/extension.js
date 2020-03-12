"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// this method is called when vs code is activated
function activate(context) {
    let timeout = undefined;
    // create a decorator type that we use to decorate small numbers
    const lowerOpacityDecorationType = vscode.window.createTextEditorDecorationType({
        dark: {
            opacity: '0.75'
        },
        light: {
            opacity: '0.6'
        }
    });
    let activeEditor = vscode.window.activeTextEditor;
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const blocks = [];
        const regExStart = /\/\*@/g;
        const regExEnd = /\*\//g;
        const text = activeEditor.document.getText();
        let startMatch;
        while (startMatch = regExStart.exec(text)) {
            const startPos = activeEditor.document.positionAt(startMatch.index + 3);
            regExEnd.lastIndex = startMatch.index + 3;
            const endMatch = regExEnd.exec(text);
            if (endMatch) {
                const endPos = activeEditor.document.positionAt(endMatch.index + 2);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                blocks.push(decoration);
            }
        }
        activeEditor.setDecorations(lowerOpacityDecorationType, blocks);
    }
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map