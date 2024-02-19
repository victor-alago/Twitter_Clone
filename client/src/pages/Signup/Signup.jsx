import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailed } from "../../redux/userSlice";

const Signup = () => {
  // state management
  const [firstname, setFirstname] = useState("");
  const [fnError, setFnError] = useState(false);
  const [lastname, setLastname] = useState("");
  const [lnError, setLnError] = useState(false);
  const [username, setUsername] = useState("");
  const [unError, setUnError] = useState(false);
  const [email, setEmail] = useState("");
  const [emError, setEmError] = useState(false);
  const [password, setPassword] = useState("");
  const [pError, setPError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpError, setCpError] = useState(false);
  const [error, setError] = useState(false);

  // dispatch
  const dispatch = useDispatch();
  // navigate
  const navigate = useNavigate();

  // handle signup function
  const handleSignup = async (e) => {
    // prevent default form submission
    e.preventDefault();
    dispatch(loginStart());

    // send user data to the server
    try {
      // use axios.post to send user data from the form state to the server
      const res = await axios.post("/auth/signup", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
      dispatch(loginSuccess(res.data));
      // navigate to home page after successful login
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
      // console.log(err);
    }
  };

  return (
    <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-7">
      <h2 className="text-2xl font-bold text-center">Create an account</h2>

      {/* server errors */}
      {error && (
        <div
          class="p-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 bg-gray-800 text-red-400"
          role="alert"
        >
          <span class="font-medium">Register Failed</span> Something went wrong
        </div>
      )}

      {/* firstname */}
      {fnError && (
        <div
          class="p-4 mb-0 text-sm text-red-800 rounded-lg bg-red-50 bg-gray-800 text-red-400"
          role="alert"
        >
          <span class="font-medium">{fnError}</span>
        </div>
      )}
      <input
        type="text"
        onChange={(e) => {
          setFirstname(e.target.value);
          if (e.target.value.length < 3) {
            setFnError("First name must be at least 3 characters long");
          } else {
            setFnError(false);
          }
        }}
        placeholder="First Name"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {/* lastname */}
      {lnError && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{lnError}</span>
        </div>
      )}
      <input
        type="text"
        onChange={(e) => {
          setLastname(e.target.value);
          if (e.target.value.length < 3) {
            setLnError("Last name must be at least 3 characters long");
          } else {
            setLnError(false);
          }
        }}
        placeholder="Last Name"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {/* username */}
      {unError && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{unError}</span>
        </div>
      )}
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
          if (e.target.value.length < 3) {
            setUnError("Username must be at least 3 characters long");
          } else {
            setUnError(false);
          }
        }}
        placeholder="Username"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {/* email */}
      {emError && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{emError}</span>
        </div>
      )}
      <input
        type="email"
        onChange={(e) => {
          setEmail(e.target.value);
          if (e.target.value.length < 3) {
            setEmError("Email must be at least 3 characters long");
          } else {
            setEmError(false);
          }
        }}
        placeholder="Email"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {/* password */}
      {pError && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{pError}</span>
        </div>
      )}
      <input
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Password"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {/* confirm password */}
      {cpError && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">{cpError}</span>
        </div>
      )}
      <input
        type="password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (e.target.value !== password) {
            setCpError("Passwords do not match!");
          } else {
            setCpError(false);
          }
        }}
        placeholder="Confirm Password"
        required
        className="text-xl py-2 px-4 rounded-full"
      />

      {!fnError && !lnError && !unError && !emError && !pError && !cpError ? (
        <button
          onClick={handleSignup}
          className="text-xl py-2 px-4 rounded-full bg-blue-500 text-white"
        >
          Sign Up
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            setError("!");
          }}
          className="text-xl py-2 px-4 rounded-full bg-blue-200 text-white"
        >
          Sign Up
        </button>
      )}

      {/* <button
        onClick={handleSignup}
        className="text-xl py-2 px-4 rounded-full bg-blue-500 text-white"
      >
        Sign Up
      </button> */}

      <p>Have an account? </p>
      <Link to="/login">
        <p className="text-blue-500 cursor-pointer">Login</p>
      </Link>
    </form>
  );
};

export default Signup;
