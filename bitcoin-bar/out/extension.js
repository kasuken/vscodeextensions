"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const request = require("request-promise");
const timers_1 = require("timers");
const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, -20);
function activate(context) {
    statusBar.command = "BitcoinBar.updatePrice";
    context.subscriptions.push(statusBar);
    context.subscriptions.push(vscode_1.commands.registerCommand("BitcoinBar.updatePrice", () => {
        updatePrice();
    }));
    updatePrice();
    timers_1.setInterval(updatePrice, 300000);
}
exports.activate = activate;
function updatePrice() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/btc/usd.json`;
        try {
            const info = (yield request({
                uri: apiUrl,
                json: true,
            }));
            if (info) {
                statusBar.text = `💰 USD: ${info.usd} ⬆️`;
                statusBar.show();
            }
            else {
                statusBar.text = "🌏 BTC Price Unavailable";
                statusBar.tooltip = "BitcoinBar";
                statusBar.show();
            }
        }
        catch (err) {
            statusBar.text = "🌏 BTC Price Unavailable";
            statusBar.tooltip = "BitcoinBar";
            statusBar.show();
        }
    });
}
//# sourceMappingURL=extension.js.map