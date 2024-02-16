import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/home");
  };
  return (
    <div>
      <section className="section loginSection">
        <div className="alertBox" id="alertBox2"></div>
        <h1 className="heading">Sign in to xero</h1>
        <button className="alternatebtn">
          <i className="fab fa-google"></i> Sign in with Google
        </button>
        <button className="alternatebtn">
          <i className="fab fa-apple"></i> Sign in with Apple
        </button>
        <p className="or">- or -</p>
        <form action="" className="form loginform">
          <input
            type="text"
            placeholder="Phone, email, or username"
            required
            id="usernameOremailOrphone"
          />

          <input type="password" placeholder="Password" required id="passwordLogin" />

          <button className="btn" onClick={handleSignIn} id="loginbtn" type="submit">
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
