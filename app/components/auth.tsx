import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";

import { Guard } from "@authing/guard-react18";
import "@authing/guard-react18/dist/esm/guard.min.css";

import { guardOptions } from "../config/authing";

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();

  const goHome = () => navigate(Path.Home);
  const resetAccessCode = () => {
    access.updateCode("");
    access.updateToken("");
  }; // Reset access code to empty string
  const goChat = () => navigate(Path.Chat);
  const guard = new Guard(guardOptions);
  console.log("guard instance: ", guard);
  // 跳转到 Authing 托管页面登录
  const goAuthingLogin = () => guard.startWithRedirect();

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>
      <div className={styles["auth-actions"]}>
        <br />
        <IconButton
          text={Locale.Auth.Login}
          type="primary"
          onClick={goAuthingLogin}
        />
        <br />
      </div>
      {!access.hideUserApiKey ? (
        <>
          <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
          <input
            className={styles["auth-input"]}
            type="password"
            placeholder={Locale.Settings.Token.Placeholder}
            value={access.token}
            onChange={(e) => {
              access.updateToken(e.currentTarget.value);
            }}
          />
        </>
      ) : null}

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={goChat}
        />
        <IconButton
          text={Locale.Auth.Later}
          onClick={() => {
            resetAccessCode();
            goHome();
          }}
        />
      </div>
    </div>
  );
}
