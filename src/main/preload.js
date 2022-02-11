const { contextBridge, ipcRenderer } = require("electron");
const { getCaptureImage } = require("../renderer/captureWindow");

const WINDOW_API = {
  sendBounds: (args) => {
    ipcRenderer.send("SEND_BOUNDS", args);
  },
  replyMessage: (args) => {
    ipcRenderer.on("REPLY_MESSAGE", (event, args) => {
      return args.error;
    });
  },
  sendMessage: (args) => ipcRenderer.send("CONFIRM", args),
  removeAllListeners: ipcRenderer.removeAllListeners("REPLY_MESSAGE"),
};

contextBridge.exposeInMainWorld("myAPI", WINDOW_API);

// キャプチャ取得
// targetSourceを受け取り、dataURLを返す
ipcRenderer.on(
  "CAPTURE",
  async (event, { targetSource, sourceDisplay, trimmedBounds }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: targetSource.id,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 4096,
            maxHeight: 4096,
          },
        },
      });
      handleStream(stream, sourceDisplay, trimmedBounds);
    } catch (error) {
      handleError(error);
    }
  }
);

function handleStream(stream, sourceDisplay, trimmedBounds) {
  // 取得したストリームをオブジェクトURLへ変換
  const videoElement = document.createElement("video");

  try {
    // Chrome
    videoElement.srcObject = stream;
  } catch (error) {
    // Chrome以外
    console.log("Your browser is not chrome:", error);
    videoElement.src = window.URL.createObjectURL(stream);
  }

  videoElement.play();
  // document.querySelector("body").appendChild(videoElement);

  videoElement.addEventListener("loadedmetadata", (e) => {
    // video要素から画像データを取得
    const dataURL = getCaptureImage(videoElement, trimmedBounds, sourceDisplay);
    // Mainプロセスへ画像データを送信
    ipcRenderer.send("REPLY_CAPTURE", { dataURL });
    videoElement.pause();

    // オブジェクトURLの破棄
    URL.revokeObjectURL(dataURL);
  });
}

function handleError(error) {
  console.log("error");
  ipcRenderer.send("REPLY_CAPTURE", { error });
}
