import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Login from './login'
import Forget from './forget'
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import ErrorPage from "./error-page";
import Album from './album' 
import Signup from './signup' 
import Reset from './resetpass' 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/album",
    element: <Album/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forget",
    element: <Forget/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset",
    element: <Reset/>,
    errorElement: <ErrorPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
