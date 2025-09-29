import styles from "./Login.module.scss";
import classNames from "classnames/bind";

import {Button} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [isRegister, setIsRegister] =  useState(false);
  const toggleForm = () => setIsRegister(!isRegister);

  const cx = classNames.bind(styles);
  return (
  <div className={cx("wrapper")}>

    <header className={cx("header")}>
      <Link to="/"><img src="/logo192.png" alt="Logo" className={cx("logo")} /></Link>
      <h1 className={cx("title")}>Welcome</h1>
      <p className={cx("subtitle")}>
        {isRegister  ? "Please register to create an account" : "Please log in to your account"}
      </p>
    </header>
    
    <div className={cx("content")}>
      <form className={cx("form")}>
        <div className={cx("form-group")}>
          <label >Username</label>
          <input type="text" id="username" name="username" required className={cx("username")} />
        </div>

        {isRegister &&
        (
          <div className={cx("form-group")}>
              <label>Email</label>
              <input type="email" name="email" required className={cx("email")} />
          </div>
        )}

        <div className={cx("form-group")}>
          <label>Password</label>
          <input type="password" id="password" name="password" required className={cx("password")} />
        </div>

        {isRegister &&
        (
          <div className={cx("form-group")}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" required className={cx("confirm-password")} />
          </div>
        )}

          <Button type="primary" block>
            {isRegister ? "Register" : "Log In"}
          </Button>

          <div className={cx("toggle-link")}>
            {isRegister ? (
              <span onClick={toggleForm}>Already have an account? Log In</span>
            ) : (
              <span onClick={toggleForm}>Don't have an account? Register</span>
            )}
          </div>
      </form>

    <div className={cx("login-google")}>
      <Button type="default">  
      <img src="/logo-gg.png" alt="Google Logo" className={cx("google-logo")} />
        Login with Google
      </Button>
    </div>



    </div>

  </div>);

}
  
export default Login;