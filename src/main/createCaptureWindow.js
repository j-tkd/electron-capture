import { BrowserWindow, desktopCapturer, ipcMain, nativeImage } from "electron";
import path from "path";

class CaptureWindow {
  constructor() {
    this.win = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    this.win.loadURL(`file://${__dirname}/../renderer/captureWindow.html`);
    this.win.webContents.openDevTools();
  }

  capture(clippingProfile) {
    const { sourceDisplay, trimmedBounds } = clippingProfile;
    return new Promise((resolve, reject) => {
      ipcMain.once("REPLY_CAPTURE", (_, { error, dataURL }) => {
        if (error) {
          reject(error);
        } else {
          // 画像データ(base64文字列)をNativeImage形式へ変換
          resolve(nativeImage.createFromDataURL(dataURL));
        }
      });

      desktopCapturer
        .getSources({ types: ["screen"] })
        .then(async (sources, error) => {
          if (error) return reject(error);
          let targetSource;
          if (sources.length === 1) {
            targetSource = sources[0];
          } else {
            targetSource = sources.find(
              (source) => source.name === sourceDisplay.name
            );
          }
          // preloadにtargetSourceを送信
          this.win.webContents.send("CAPTURE", {
            targetSource,
            sourceDisplay,
            trimmedBounds,
          });
          if (!targetSource) {
            return reject({ message: "No available source" });
          }
        });
    });
  }

  close() {
    this.win.close();
  }
}

const createCaptureWindow = () => new CaptureWindow();

export default createCaptureWindow;
