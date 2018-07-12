const vscode = require('vscode');
const rp = require("request-promise");

function UpdateWeather() {
    const options = {
        method: "GET",
        uri: "https://api.apixu.com/v1/current.json?key=4cb51e4aeb5f48d0b3d02832181803&q=auto:ip",
        headers: {
          "User-Agent": "Request-Promise"
        },
        json: true
      };
    
      rp(options).then(r => {
        const currentWeather = r;

        vscode.window.setStatusBarMessage("$(radio-tower) Current Weather: " + currentWeather.current.condition.text + " - Temp: " + currentWeather.current.temp_c + "°");
        vscode.window.showInformationMessage ('The weather in ' + currentWeather.location.name + " is " + currentWeather.current.condition.text + " with a temperature of " + currentWeather.current.temp_c + "°.");
      });
}

function activate(context) {

    let disposable = vscode.commands.registerCommand('extension.updateWeather', function () {
        UpdateWeather();
    });

    UpdateWeather();

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;