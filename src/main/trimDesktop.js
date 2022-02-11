import { screen, BrowserWindow, ipcMain } from "electron";
import path from "path";

export const trimDesktop = () => {
  const displays = screen.getAllDisplays();
  return new Promise((resolve, reject) => {
    const windows = displays.map((display, i) => {
      const { x, y, width, height } = display.bounds;
      display.name = `Screen_${i + 1}`;
      const win = new BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        x,
        y,
        width,
        height,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        },
      });
      win.loadURL(`file://${__dirname}/../renderer/index.html`);

      // win.webContents.openDevTools();
      return { win, display };
    });
    ipcMain.once("SEND_BOUNDS", (event, { trimmedBounds }) => {
      const sourceDisplay = windows.find(
        (w) => w.win.webContents.id === event.sender.id
      ).display;
      const profile = { sourceDisplay, trimmedBounds };
      windows.forEach((w) => w.win.close());
      resolve(profile);
    });
  });
};
