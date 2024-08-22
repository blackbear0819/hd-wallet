
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, HomeLayout, Landing, Login, Logout, Register } from "./pages";
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import RestoreWallet from "./pages/RestoreWallet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "restore",
        element: <RestoreWallet />,
      }
    ],
  },
]);

function App() {
  if (localStorage.auth !== undefined) {
    const token = JSON.parse(localStorage.auth);
    axios.defaults.baseURL = 'http://localhost:3000';
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-right'
        theme="colored"
      />
    </>
  )
}

export default App
