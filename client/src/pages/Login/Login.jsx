import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailed } from "../../redux/userSlice";

const Login = () => {
  // state management
  const [email, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [error, setError] = useState(false);

  // dispatch
  const dispatch = useDispatch();
  // navigate
  const navigate = useNavigate();

  // handle login functions
  const handleLogin = async (e) => {
    e.preventDefault();
    // dispatch login start when user tries to login
    dispatch(loginStart());

    try {
      // use axios.post to send user data from the form state to the server
      const res = await axios.post("/auth/login", { email, userPassword });

      // dispatch loginSuccessful if user is successfully logged in, and pass the user data to the action
      // this gets the user json object from the response and passes it to the action
      dispatch(loginSuccess(res.data));
      // navigate to home page after successful login
      navigate("/");
      // console.log('res', res.data);
    } catch (err) {
      setError(true);
      // if user login fails, dispatch loginFailed: sets error to true
      dispatch(loginFailed());
      // console.log(err)
    }
  };

  return (
    <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
      <h2 className="text-Sxl font-bold text-center">Sign in to X</h2>
      {error && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">Login Failed</span> Invalid email or password
        </div>
      )}

      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="text-xl py-2 px-4 rounded-full"
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="text-xl py-2 px-4 rounded-full"
      />

      <button
        onClick={handleLogin}
        className="text-xl py-2 px-4 rounded-full bg-blue-500 text-white"
      >
        Login
      </button>

      <p>Don't have an account? </p>
      <Link to="/signup">
        <p className="text-blue-500 cursor-pointer">Register</p>
      </Link>
    </form>
  );
};

export default Login;
