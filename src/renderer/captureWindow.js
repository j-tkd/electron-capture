export const getCaptureImage = (videoElement, trimmedBounds, sourceDisplay) => {
  // video要素の幅と高さを取得
  const { videoWidth, videoHeight } = videoElement;

  // キャプチャ対象スクリーンの表示倍率を取得
  const s = sourceDisplay.scaleFactor || 1;

  // video要素内におけるデスクトップ画像の余白サイズ算出
  const blankWidth = Math.max(
    (videoWidth - sourceDisplay.bounds.width * s) / 2,
    0
  );
  const blankHeight = Math.max(
    (videoHeight - sourceDisplay.bounds.height * s) / 2,
    0
  );

  // video要素内における切り取り対象領域の壱算出
  const offsetX = (trimmedBounds.x - sourceDisplay.bounds.x) * s + blankWidth;
  const offsetY = (trimmedBounds.y - sourceDisplay.bounds.y) * s + blankHeight;

  // canvas要素の作成
  const canvasElement = document.createElement("canvas");
  const context = canvasElement.getContext("2d");

  // 切り取り対象領域の幅と高さをcanvas要素にセット
  canvasElement.width = trimmedBounds.width;
  canvasElement.height = trimmedBounds.height;

  // canvas要素にvideo要素の内容を描画
  context.drawImage(
    videoElement, // 切り抜き対象
    offsetX, // 切り抜き始点X
    offsetY, // 切り抜き始点Y
    trimmedBounds.width * s, // 切り抜きサイズ横
    trimmedBounds.height * s, // 切り抜きサイズ縦
    0, // Canvasの描画開始位置X
    0, // Canvasの描画開始位置Y
    trimmedBounds.width, // Canvasの描画サイズ横
    trimmedBounds.height // Canvasの描画サイズ縦
  );
  console.log(canvasElement);

  // canvas要素から画像データを取得
  return canvasElement.toDataURL("image/png");
};
