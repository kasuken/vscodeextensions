const vscode = require('vscode');
const rp = require("request-promise");

function GetIp() {

    const options = {
        method: "GET",
        uri: "https://api.ipify.org",
        headers: {
          "User-Agent": "Request-Promise"
        }
      };
    
      rp(options).then(r => {
        const ip = r;
        vscode.window.setStatusBarMessage("Public Ip: " + ip);
      });

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    let disposable = vscode.commands.registerCommand('extension.updateMyIp', function () {
        GetIp();
    });

   GetIp();

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;