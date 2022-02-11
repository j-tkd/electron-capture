import React, { useEffect, useState } from "react";
import styles from "./Viewer.css";

export const Viewer = ({ src }) => {
  const [state, setState] = useState({
    message: "",
    sending: false,
  });

  useEffect(() => {
    const error = window.myAPI.replyMessage();
    if (error) {
      setState({ message: state.message, sendeing: false });
    } else {
      setState({ message: "", sendeing: true });
    }

    return () => window.myAPI.removeAllListeners();
  }, []);

  const renderConfirmBtn = () => {
    if (state.sending) {
      return <div className={styles.sending}>完了</div>;
    } else {
      return (
        <button type="submit" className="btn">
          Confirm
        </button>
      );
    }
  };

  const handleOnChangeMessage = (e) => {
    setState({ sending: state.sending, message: e.target.value });
  };

  const handleOnSubmit = (e) => {
    const { message, sending } = state;
    if (!message.length || sending) return;

    // Mainプロセスへメッセージを送る
    window.myAPI.sendMessage(state.message);
    setState({ message: state.message, sendeing: true });
    e.preventDefault();
  };

  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <div>
          <img src={src} alt="capture" />
        </div>
      </div>
      <form className={styles.form} onSubmit={handleOnSubmit}>
        <input
          placeholder="message"
          value={state.message}
          onChange={handleOnChangeMessage}
        />
        {renderConfirmBtn()}
      </form>
    </div>
  );
};
