import { app, shell } from "electron";
import { trimDesktop } from "./trimDesktop";
import createCaptureWindow from "./createCaptureWindow";
import createFileManager from "./createFileManager";
import createPreviewWindow from "./createPreviewWindow";

let captureWindow;

function captureAndOpenItem() {
  const fileManager = createFileManager();
  return trimDesktop()
    .then((profile) => captureWindow.capture(profile))
    .then((image) => {
      // 一時ファイル保存用ディレクトリに取得した画像を保存
      const createdFileName = fileManager.writeImage(
        app.getPath("temp"),
        image
      );
      return createdFileName;
    })
    .then((filename) => {
      console.log("filename:", filename);
      const win = createPreviewWindow(filename);
      win.once("DONE", (args) => {
        console.log("Message: ", args);
        win.close();
        if (process.platform !== "darwin") {
          app.quit();
        }
      });
    })
    .catch((error) => console.error(error));
}

app.on("ready", () => {
  captureWindow = createCaptureWindow();
  captureAndOpenItem();
});
