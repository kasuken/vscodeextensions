const vscode = require('vscode');
const rp = require("request-promise");

function UpdateWeather() {
    const options = {
        method: "GET",
        uri: "http://api.weatherstack.com//v1/current.json?key=4cb51e4aeb5f48d0b3d02832181803&q=auto:ip",
        headers: {
          "User-Agent": "Request-Promise"
        },
        json: true
      };
    
      rp(options).then(r => {
        var currentWeather = r;

        vscode.window.setStatusBarMessage("$(radio-tower) Current Weather at " + currentWeather.location.name + ": " + currentWeather.current.condition.text + " - Temp: " + currentWeather.current.temp_c + "°");
        vscode.window.showInformationMessage ('The weather in ' + currentWeather.location.name + " is " + currentWeather.current.condition.text + " with a temperature of " + currentWeather.current.temp_c + "°.");
      });
}

function activate(context) {

    let disposable = vscode.commands.registerCommand('current-weather.updateWeather', function () {
        UpdateWeather();
    });

    UpdateWeather();

    setInterval(UpdateWeather, 3600000);

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;