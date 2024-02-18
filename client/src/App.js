import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Messages from "./pages/Messages/Messages";
import Error from "./pages/Error/Error";
import Tweet from "./pages/Tweet/Tweet";
import Navbar from "./components/navbar/Navbar";
import "./App.css";

// create a theme for the website
const Layout = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <Outlet></Outlet>
    </div>
  );
};

// create router
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/tweets/find/:id",
        element: <Tweet />,
      },
      {
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/logout",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
