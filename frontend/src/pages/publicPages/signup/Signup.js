import React from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  return (
    <div>
      <section className="section">
        <div className="alertBox" id="alertBox"></div>
        <h1 className="heading">Join xero Today.</h1>
        <form action="" className="form">
          <input type="text" placeholder="Full name" required id="fullName" />
          <input type="text" placeholder="Username" required id="username" />
          <input type="email" placeholder="Email" required id="email" />
          <input type="password" placeholder="Password" required id="password" />
          <button className="btn" id="signupbtn" type="submit">
            Sign Up
          </button>
        </form>
        <div className="loginLinkDiv">
          <p className="member">
            Already a member?{" "}
            <Link to="/login" className="loginLink">
              {" "}
              Login{" "}
            </Link>
          </p>
          <p className="member">
            Too lazy?{" "}
            <Link to="/" className="loginLink">
              {" "}
              Use a demo account{" "}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Signup;
