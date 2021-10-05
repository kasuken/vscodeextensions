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
import { setInterval } from "timers";

interface PriceInfo {
	date: string;
	usd: number;
}

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, -20);

export function activate(context: ExtensionContext) {
	statusBar.command = "BitcoinBar.updatePrice";
	context.subscriptions.push(statusBar);
  
	context.subscriptions.push(
	  commands.registerCommand("BitcoinBar.updatePrice", () => {
		updatePrice();
	  })
	);
  
	updatePrice();
	setInterval(updatePrice, 300000);
  }

  async function updatePrice() {
	const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/btc/usd.json`;
  
	try {
	  const info = (await request({
		uri: apiUrl,
		json: true,
	  })) as PriceInfo;
  
	  if (info) {
		statusBar.text = `💰 USD: ${info.usd} ⬆️`;
		statusBar.show();
	  } else {
		statusBar.text = "🌏 BTC Price Unavailable";
		statusBar.tooltip = "BitcoinBar";
		statusBar.show();
	  }
	} catch (err) {
	  statusBar.text = "🌏 BTC Price Unavailable";
	  statusBar.tooltip = "BitcoinBar";
	  statusBar.show();
	}
  }