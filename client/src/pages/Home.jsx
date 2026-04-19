import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModel from '../components/LoginModel'
import { useSelector, useDispatch } from 'react-redux'
import { Coins } from "lucide-react"
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { Navigate, useNavigate } from "react-router-dom"

function Home() {
  const [openLogin,setOpenLogin] = useState(false)
  const {userData} = useSelector((state)=>state.user)
  const [openProfle,setOpenProfile] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output"
  ]

  const handleLogout=async()=>{
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`,{
        withCredentials:true
      })
      console.log("logout",res)
      dispatch(setUserData(null))
      setOpenProfile(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
      <motion.div 
      initial={{opacity:0,y:-40}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='text-lg font-semibold'>
            GenWeb.ai
          </div>
          <div className='flex items-center gap-5'>
            <div onClick={()=>{navigate("/pricing")}} className='hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer'>
                Pricing
            </div>

            {userData && <div onClick={()=>{navigate("/pricing")}} className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition'>
                <Coins size={14} className='text-yellow-400'/>
                <span className='text-zinc-300'>Credits</span>
                <span className='font-semibold'>{userData.credits}</span>
              </div>}

            {
              !userData ?
            <button onClick={()=>{setOpenLogin(true)}} className='px-4 py-2 rounded-lg border border-white/20 hover:border-white/10 text-sn'>
              Get Started
            </button>
              :
            <div className='relative'>
             <button className='flex items-center' onClick={()=>{setOpenProfile(!openProfle)}}>
                <img src={userData.avatar} onError={(e) => {e.target.src = `https://ui-avatars.com/api/?name=${userData?.name}`;}}
                referrerPolicy="no-referrer" alt="user profile" className='w-9 h-9 rounded-full border border-white/20 object-cover'/>
             </button>

               <AnimatePresence>
                  {openProfle && (
                    <>
                      <motion.div
                      initial={{opacity:0,y:-10,scale:0.95}}
                      animate={{opacity:1,y:0,scale:1}}
                      exit={{opacity:0,y:-10,scale:0.95}}
                      className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'>
                        <div className='px-4 py-3 border-b border-white/10'>
                          <p className='text-sm font-medium truncate'>{userData.name}</p>
                          <p className='text-xs text-zinc-500 truncate'>{userData.email}</p>
                        </div>

                        <button onClick={()=>{navigate("/dashboard")}} className='w-full px-4 py-3 text-left text-sm hover:bg-white/5'>Dashboard</button>
                        <button onClick={()=>{handleLogout()}} className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5'>Logout</button>
                      </motion.div>
                    </>
                  )}
               </AnimatePresence>
            </div>
            }
          </div>
        </div>
      </motion.div>

      <section className='pt-44 pb-32 px-6 text-center'>
        <motion.h1
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        className='text-3xl md:text-7xl font-bold tracking-tight'>
          Build Stunning Websites <br />
          <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
            with AI
          </span>
        </motion.h1>

        <motion.p
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'>
          Describe your idea and let Ai generate a modern,
          responsive, production-ready website.
        </motion.p>

        <button onClick={()=>{userData ? navigate("/dashboard") : setOpenLogin(true)}} className='px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12'>
          {userData ? "Go to dashboard" :"Get Started"}
        </button>
      </section>

      <section className='max-w-7xl mx-auto px-6 pb-32'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {
            highlights.map((h,i)=>(
              <motion.div
              key={i}
              initial={{opacity:0,y:40}}
              whileInView={{opacity:1,y:0}}
              className='rounded-2xl bg-white/5 border border-white p-8 '>
                <h1 className='text-xl font-semibold mb-3'>{h}</h1>
                <p className='text-sm text-zinc-400'>
                  GenWeb.ai builds real websites - clean code,
                  animations, responsiveness and scaleable structure.
                </p>
              </motion.div>
            ))
          }
        </div>
      </section>

      <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
        &copy; {new Date().getFullYear()} GenWeb.ai
      </footer>

      {openLogin && <LoginModel open={openLogin} onClose={()=>{setOpenLogin(false)}}/>}
    </div>
  )
}

export default Home
