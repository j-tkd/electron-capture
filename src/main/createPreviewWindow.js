import { BrowserWindow, ipcMain } from "electron";
import path from "path";
import { EventEmitter } from "events";
import createFileManager from "./createFileManager";
import { file } from "babel-types";

class PreviewWindow extends EventEmitter {
  constructor(filename) {
    super();
    this.win = new BrowserWindow({
      width: 500,
      height: 430,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    this.filemanager = createFileManager();
    this.filename = filename;
    console.log("Preview:", filename);
    this.win.loadURL(
      `file://${__dirname}/../renderer/previewWindow.html?filename=${filename}`
    );
    this.win.webContents.openDevTools();

    ipcMain.on("CONFIRM", (event, args) => {
      console.log("CONFIRM", args);
      this.emit("DONE", args);
    });
    this.win.on("close", () => {
      console.log("close");
    });
  }

  close() {
    this.win.close();
  }
}

function createPreviewWindow(filename) {
  return new PreviewWindow(filename);
}

export default createPreviewWindow;
