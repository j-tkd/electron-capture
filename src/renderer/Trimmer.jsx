import React, { useEffect, useState } from "react";
import styles from "./trimmer.css";

const position2Bounds = ({ x1, x2, y1, y2 }) => {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return { x, y, width, height };
};

export const Trimmer = () => {
  const [state, setState] = useState({
    isClipping: false,
    clientPosition: {},
    screenPosition: {},
  });

  const handleOnMouseDown = (e) => {
    const clientPosition = {
      x1: e.clientX,
      y1: e.clientY,
      x2: e.clientX,
      y2: e.clientY,
    };
    const screenPosition = {
      x1: e.screenX,
      y1: e.screenY,
      x2: e.screenX,
      y2: e.screenY,
    };
    setState({
      isClipping: true,
      clientPosition,
      screenPosition,
    });
  };

  const handleOnMouseUp = () => {
    setState({ isClipping: false });
    // 矩形情報を位置情報へ変換
    const trimmedBounds = position2Bounds(state.screenPosition);
    if (trimmedBounds.width > 100 && trimmedBounds.height > 100) {
      // 切り取り対象の位置情報をMainプロセスへ送信
      window.myAPI.sendBounds({ trimmedBounds });
    }
  };

  const handleOnMove = (e) => {
    if (!state.isClipping) return;
    const clientPosition = state.clientPosition;
    clientPosition.x2 = e.clientX;
    clientPosition.y2 = e.clientY;
    const screenPosition = state.screenPosition;
    screenPosition.x2 = e.screenX;
    screenPosition.y2 = e.screenY;
    setState({ isClipping: state.isClipping, clientPosition, screenPosition });
  };

  const handleOnMouseEnter = (e) => {
    if (!e.buttons) setState({ isClipping: false });
  };

  const renderRect = () => {
    const bounds = position2Bounds(state.clientPosition);
    const inlineStyle = {
      left: bounds.x,
      top: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
    return <div className={styles.rect} style={inlineStyle} />;
  };

  return (
    <div
      className={styles.root}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMove}
      onMouseEnter={handleOnMouseEnter}
    >
      {state.isClipping ? renderRect() : <div />}
    </div>
  );
};

export default Trimmer;
