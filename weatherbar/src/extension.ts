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

interface WeatherInfo {
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

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
  "50d": "🌫"
};

let weatherInfo: WeatherInfo;
let location = workspace.getConfiguration("WeatherBar").get<string>("location");
let appKey = "60460592fcaf648b5d3d971861702ea7";

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, -10);

export function activate(context: ExtensionContext) {
  statusBar.command = "WeatherBar.updateConfiguration";
  context.subscriptions.push(statusBar);

  context.subscriptions.push(
    commands.registerCommand("WeatherBar.updateConfiguration", () => {
      updateConfiguration();
    })
  );

  if (!location) {
    statusBar.text = "🌈 Set location";
    statusBar.tooltip = "WeatherBar";
    statusBar.show();
  }

  updateWeatherInfo();
  setInterval(updateWeatherInfo, 60 * 1000);
}

function updateLocation(newLocation: string | undefined) {
  location = newLocation;
  workspace
    .getConfiguration("WeatherBar")
    .update("location", newLocation, ConfigurationTarget.Global);
}

async function updateConfiguration() {
  const _location = await window.showInputBox({
    value: location,
    ignoreFocusOut: true,
    prompt: "City. i.e. London",
  });
  updateLocation(_location);

  if (!location) {
    statusBar.text = "🌈 Set location";
    statusBar.tooltip = "WeatherBar";
    statusBar.show();
  } else {
    updateWeatherInfo();
  }
}

async function updateWeatherInfo() {
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
  let text =
    Math.round(weatherInfo.main.temp) +
    "℃/" +
    Math.round(weatherInfo.main.temp * 1.8 + 32) +
    "℉";

  let icon = "";
  switch (weatherInfo.weather[0].icon) {
    case "01d":
      icon += IMAGES["01d"] + " ";
      break;
    case "02d":
      icon += IMAGES["02d"] + " ";
      break;
    case "03d":
      icon += IMAGES["03d"] + " ";
      break;
    case "04d":
      icon +=IMAGES["04d"] + " ";
      break;
    case "09d":
      icon += IMAGES["09d"] + " ";
      break;
    case "10d":
      icon += IMAGES["10d"] + " ";
      break;
    case "11d":
      icon += IMAGES["11d"] + " ";
      break;
    case "13d":
      icon += IMAGES["13d"] + " ";
      break;
    case "50d":
      icon += IMAGES["50d"] + " ";
      break;
    default:
      icon += IMAGES["50d"] + " ";
  }

  text = icon + " " + text + " - " + weatherInfo.weather[0].description;
  statusBar.text = text;
  statusBar.tooltip = weatherInfo.weather[0].description;
  statusBar.show();
}
