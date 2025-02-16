const vscode = require('vscode');

function activate(context) {
    console.log('Eklenti etkinleştirildi!');

    const removeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    removeButton.text = 'Clean Comments';
    removeButton.command = 'cleancomms.removeComments';
    removeButton.show();

    let disposable = vscode.commands.registerCommand('cleancomms.removeComments', function () {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage('Lütfen bir dosya açın!');
            return;
        }

        const document = editor.document;
        const fullText = document.getText();
        
        const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;

        const newText = fullText.replace(commentRegex, '');
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fullText.length)
        );

        editor.edit(editBuilder => {
            editBuilder.replace(fullRange, newText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Tüm yorum satırları silindi!');
            } else {
                vscode.window.showErrorMessage('Yorumlar silinemedi.');
            }
        });
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(removeButton);

    console.log('Buton ve komut başarıyla kaydedildi!');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
