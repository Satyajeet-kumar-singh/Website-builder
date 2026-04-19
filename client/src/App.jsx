import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import { useSelector } from 'react-redux'
import Generate from './pages/Generate'
import Dashboard from "./pages/Dashboard"
import WebsiteEditor from './pages/WebsiteEditor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'

function App() {
  useGetCurrentUser()
  const {userData} = useSelector((state)=>state.user)
  const router = createBrowserRouter([
   {
     path:"/",
    element: <Home/>
   },
   {
    path:"dashboard",
    element: userData ? <Dashboard/> : <Navigate to={"/"}/>
   },
   {
    path:"generate",
    element: userData ? <Generate/> : <Navigate to={"/"}/>
   },
   {
    path:"editor/:id",
    element: userData ? <WebsiteEditor/> : <Navigate to={"/"}/>
   },
   {
    path:"site/:id",
    element: <LiveSite/>
   },
   {
    path:"pricing",
    element: <Pricing/>
   }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
