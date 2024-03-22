import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Messages from "./pages/Messages/Messages";
import Error from "./pages/Error/Error";
import Bookmark from "./pages/Bookmark/Bookmark";
import Setting from "./pages/Setting/Setting";
import AccountSetting from "./pages/Setting/AccountSetting/AccountSetting";
import Tweet from "./pages/Tweet/Tweet";
import TrendingPage from "./pages/TrendingPage/TrendingPage";
import Navbar from "./components/navbar/Navbar";
import MessageList from "./components/messages/MessageList";
import "./App.css";

// create a theme for the website
const Layout = () => {
  const location = useLocation(); // Use the useLocation hook to get the current path

  // Determine if the Navbar should be shown based on the current path
  const showNavbar = !location.pathname.startsWith('/setting');

  return (
    <div className="mx-auto">
      {showNavbar && <Navbar />}
      <Outlet />
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
        path: "/:username/messages",
        element: <Messages />,
      },
      {
        path: "/bookmark",
        element: <Bookmark />,
      },
      {
        path: "/trending/:tag/tweets",
        element: <TrendingPage />,
      },
      {
        path: "/setting",
        element: <Outlet />, // Use Outlet here since Layout is already wrapping it
        children: [
          { index: true, element: <Setting /> },
          { 
            path: "account", 
            element: <AccountSetting />,
           },
        ],
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
