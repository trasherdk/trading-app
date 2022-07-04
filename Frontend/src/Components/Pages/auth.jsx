// importing all rquired tools
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logInLoading,
  logInFailure,
  logInSuccess,
  signUpLoading,
  signUpFailure,
  signUpSuccess,
} from "../Redux/authRedux/atuhAction";
import axios from "axios";

// importing auth stylesheet
import "../Styles/auth.css";

// Main LoginSignup function and exporting it
export const LoginSignup = () => {
  // changing body background image for auth page
  document.body.style.background = "none";
  document.body.style.background =
    "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";

  // states for props login, remember and cookies
  const [login, setlogin] = useState(true);
  const [remember, setremember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // navigate and dispatch funciton
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // initial signin object
  const sampleSignin = {
    email: "",
    password: "",
  };

  // initial signup object
  const sampleSignup = {
    profilePhoto: null,
    password: "",
    email: "",
    name: "",
  };

  // accessing isAuth from redux
  const { isAuth } = useSelector((state) => state.auth);

  // main signindata and signup data
  const [signinData, setsigninData] = useState(sampleSignin);
  const [signupData, setsignupData] = useState(sampleSignup);

  // handleSigninChanges function handle changes in signin data object
  function handleSigninChanges({ target }) {
    const { name, value } = target;

    setsigninData((prev) => ({ ...prev, [name]: value }));
  }

  // handleSigninChanges function handle changes in signup data object
  function handleSignupChanges({ target }) {
    const { name, value, files } = target;

    const data = name === "profilePhoto" ? files[0] : value;

    // console.log(data);

    setsignupData((prev) => ({ ...prev, [name]: data }));
  }

  // this for checking token in cookies
  useEffect(() => {
    let user = cookies.covidUserId;

    if (user) {
      dispatch(logInSuccess(user));
      navigate("/");
    }
  }, []);

  // posting signinData to get token of user
  function signinSubmit() {
    dispatch(logInLoading());
    console.log("==> logging in");

    setTimeout(() => {
      axios
        .post("https://deep-covid-tracker.herokuapp.com/auth/login", signinData)
        .then((res) => {
          let { error, token } = res.data;
          if (error) {
            dispatch(logInFailure());
          } else {
            dispatch(logInSuccess(token));
            if (remember) {
              setCookie("covidUserId", token, { path: "/" });
            }
            console.log("==> logged in");
            setTimeout(() => {
              navigate("/");
              console.clear();
            }, 100);
          }
        })
        .catch((err) => {
          dispatch(logInFailure());
          alert("Something went wrong try again");
        });
    }, 2000);
  }

  // posting signupData to get token of user
  function signupSubmit() {
    let file = document.getElementsByName("profilePhoto")[0].files[0];
    let formData = {
      name: signupData.name,
      password: signupData.password,
      email: signupData.email,
      profilePhoto: file,
    };
    console.log(formData);
    dispatch(signUpLoading());
    // setTimeout(() => {
    axios
      .post("http://localhost:8080/auth/register", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
      .then((res) => {
        let { error, token } = res.data;
        if (error) {
          dispatch(signUpFailure());
        } else {
          dispatch(signUpSuccess(token));
          console.log(token);
          alert("You are successfully registered. Log in now");
          // setTimeout(() => {
          //   console.clear();
          // }, 100);
        }
      })
      .catch((err) => {
        dispatch(signUpFailure());
        alert("Something went wrong try again");
      });
    // }, 2000);
  }

  //   console.clear();

  // returning main display div
  return (
    <div>
      {/* Navbar */}
      <div id="home-navbar-main">
        <div id="navbar-logo-div">
          <h2 id="navbar-logo-text">JUST TRADE</h2>
        </div>
        <Button
          variant="outlined"
          id="home-navbar-log-in"
          onClick={() => navigate("/")}
        >
          HOME
        </Button>
      </div>
      {/* Login signup div */}
      <div id="login-signup-component">
        <div id="login-signup-main">
          {/* main signin and signup buttons */}
          <div id="login-signup-heading">
            {login === true ? (
              <p
                style={{ borderTopLeftRadius: "10px" }}
                onClick={() => setlogin(true)}
              >
                Sign In
              </p>
            ) : (
              <p
                style={{ borderTopLeftRadius: "10px", backgroundColor: "gray" }}
                onClick={() => setlogin(true)}
              >
                Sign In
              </p>
            )}
            {login === true ? (
              <p
                style={{
                  borderTopRightRadius: "10px",
                  backgroundColor: "gray",
                }}
                onClick={() => setlogin(false)}
              >
                Sign Up
              </p>
            ) : (
              <p
                style={{
                  borderTopRightRadius: "10px",
                }}
                onClick={() => setlogin(false)}
              >
                Sign Up
              </p>
            )}
          </div>
          {/* Main signin and signup form */}
          {login === true ? (
            // Sign in form
            <div id="login-main">
              <h1>SIGN IN HERE</h1>
              <form style={{ marginBottom: "5px" }}>
                <label className="signin-label">EMAIL</label>
                <br />
                <input
                  type="email"
                  name="email"
                  defaultValue=""
                  placeholder="ENTER EMAIL HERE..."
                  className="signin-input"
                  onChange={(event) => handleSigninChanges(event)}
                />
                <br />

                <label className="signin-label">PASSWORD</label>
                <br />
                <input
                  type="password"
                  name="password"
                  defaultValue=""
                  placeholder="ENTER PASSWORD HERE..."
                  className="signin-input"
                  onChange={(event) => handleSigninChanges(event)}
                />
              </form>
              <br />
              <div id="remember-main-div">
                <input
                  type="checkbox"
                  onChange={() => {
                    if (remember == false) {
                      setremember(() => true);
                      return;
                    }
                    setremember(() => false);
                  }}
                />
                <p>REMEMBER ME</p>
              </div>
              <br />
              <button id="signin-button" onClick={() => signinSubmit()}>
                SIGN IN
              </button>
            </div>
          ) : (
            // sign up form
            <div id="signup-main">
              <h1>SIGN UP HERE</h1>
              <form style={{ marginBottom: "5px" }}>
                <label className="signin-label">PROFILE PHOTO</label>
                <br />
                <input
                  type="file"
                  name="profilePhoto"
                  className="signin-input"
                  defaultValue=""
                  onChange={(event) => handleSignupChanges(event)}
                />
                <br />
                <label className="signin-label">FULL NAME</label>
                <br />
                <input
                  type="text"
                  name="name"
                  placeholder="ENTER NAME HERE..."
                  className="signin-input"
                  defaultValue=""
                  onChange={(event) => handleSignupChanges(event)}
                />
                <br />
                <label className="signin-label">EMAIL ID</label>
                <br />
                <input
                  type="email"
                  name="email"
                  placeholder="ENTER EMAIL HERE..."
                  className="signin-input"
                  defaultValue=""
                  onChange={(event) => handleSignupChanges(event)}
                />
                <br />
                <label className="signin-label">PASSWORD</label>
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="ENTER PASSWORD HERE..."
                  className="signin-input"
                  defaultValue=""
                  onChange={(event) => handleSignupChanges(event)}
                />
              </form>
              <br />
              <button id="signin-button" onClick={() => signupSubmit()}>
                SIGN UP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
