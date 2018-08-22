const vscode = require('vscode');
const rp = require("request-promise");

function DisplayIp() {

    const options = {
        method: "GET",
        uri: "https://api.ipify.org",
        headers: {
          "User-Agent": "Request-Promise"
        }
      };
    
      rp(options).then(r => {
        const ip = r;

        const statusBarItem = vscode.window.createStatusBarItem();
        statusBarItem.text = "Public Ip: " + ip;
        statusBarItem.command = "mypublicip.openMyIpSite";
        
        statusBarItem.show();
      });

}

function activate(context) {

    let updateMyIp = vscode.commands.registerCommand('mypublicip.updateMyIp', function () {
        DisplayIp();
    });

    context.subscriptions.push(updateMyIp);

    let openMyIpSite = vscode.commands.registerCommand('mypublicip.openMyIpSite', function () {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://www.whatismyip.com/'));
    });

    context.subscriptions.push(openMyIpSite);

    DisplayIp();
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;