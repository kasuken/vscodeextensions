"use strict";

import {
  ExtensionContext,
  StatusBarAlignment,
  window,
  commands,
  workspace,
  ConfigurationTarget,
} from "vscode";
import * as request from "request-promise";

const IMAGES = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "⛅",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "☔️",
  "09n": "☔️",
  "10d": "☔️",
  "10n": "☔️",
  "11d": "⚡️",
  "11n": "⚡️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫",
  "50n": "🌫",
};

let weatherType = WeatherType.Temperature;
let weatherInfo: WeatherInfo;
let location = workspace.getConfiguration("WeatherBar").get<string>("location");
let appKey = workspace.getConfiguration("WeatherBar").get<string>("key");

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, -10);

export function activate(context: ExtensionContext) {

  debugger;

  statusBar.command = "WeatherBar.switchWeatherType";
  context.subscriptions.push(statusBar);

  context.subscriptions.push(
    commands.registerCommand("WeatherBar.switchWeatherType", () => {
      switchWeatherType();
    })
  );

  context.subscriptions.push(
    commands.registerCommand("WeatherBar.updateConfiguration", () => {
      updateConfiguration();
    })
  );

  if (!location || !appKey) {
    statusBar.text = "🌈 Set location and API Key";
    statusBar.tooltip = "Instant Weather";
    statusBar.show();
  }

  updateWeatherInfo();
  setInterval(updateWeatherInfo, 60 * 1000);
}

function switchWeatherType() {
  if (!location || !appKey) {
    updateConfiguration();
    return;
  }

  if (!weatherInfo) {
    return;
  }

  if (weatherType + 1 > 3) {
    weatherType = WeatherType.Temperature;
  } else {
    weatherType++;
  }

  updateStatus();
}

function updateLocation(newLocation: string | undefined) {
  location = newLocation;
  workspace
    .getConfiguration("WeatherBar")
    .update("location", newLocation, ConfigurationTarget.Global);
}

function updateAppKey(newKey: string | undefined) {
  appKey = newKey;
  workspace
    .getConfiguration("WeatherBar")
    .update("key", newKey, ConfigurationTarget.Global);
}

async function updateConfiguration() {
  const _location = await window.showInputBox({
    value: location,
    ignoreFocusOut: true,
    prompt: "City. i.e. Shanghai,CN",
  });
  updateLocation(_location);
  const _appKey = await window.showInputBox({
    value: appKey,
    ignoreFocusOut: true,
    prompt: "API Key for OpenWeatherMap.org",
  });
  updateAppKey(_appKey);

  if (!location || !appKey) {
    statusBar.text = "🌈 Set location and API Key";
    statusBar.tooltip = "WeatherBar";
    statusBar.show();
  } else {
    updateWeatherInfo();
  }
}

async function updateWeatherInfo() {
  if (!location || !appKey) {
    return;
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${appKey}`;

  try {
    const info = (await request({
      uri: apiUrl,
      json: true,
    })) as WeatherInfo;

    if (info) {
      weatherInfo = info;
      updateStatus();
    } else {
      statusBar.text = "🌏 Weather Unavailable";
      statusBar.tooltip = "WeatherBar";
      statusBar.show();
    }
  } catch (err) {
    statusBar.text = "🌏 Weather Unavailable";
    statusBar.tooltip = "WeatherBar";
    statusBar.show();
  }
}

function updateStatus(): void {
  let text = "";

  switch (weatherType) {
    case WeatherType.Temperature: {
      text =
        Math.round(weatherInfo.main.temp) +
        "℃/" +
        Math.round(weatherInfo.main.temp * 1.8 + 32) +
        "℉";
      break;
    }
    default: {
      break;
    }
  }

  //text = IMAGES[weatherInfo.weather[0].icon] + " " + text;
  statusBar.text = text;
  statusBar.tooltip = weatherInfo.weather[0].description;
  statusBar.show();
}
