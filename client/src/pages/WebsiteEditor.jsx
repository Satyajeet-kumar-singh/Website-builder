import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import axios from "axios"
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Editor from "@monaco-editor/react"

function WebsiteEditor() {
    const { id } = useParams()
    const [website,setWebsite] = useState(null)
    const [error,setError] = useState("")
    const [code,setCode] = useState("")
    const [messages,setMessages] = useState([])
    const [prompt,setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [updateLoading,setupdateLoading] = useState(false)
    const [thinkingIndex,setthinkingIndex] = useState(0)
    const [showCode,setShowCode] = useState(false)
    const [showFullpreview,setShowFullpreview] = useState(false)
    const [showChat,setShowChat] = useState(false)
    const thinkingSteps = [
        "understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing update..."
    ]

    const handleUpdate=async()=>{
        if(!prompt) return
        setupdateLoading(true)
        setMessages((prev)=>[...prev,{role:"user",content:prompt}])
        const text = prompt
        setPrompt("")
        try {
            const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/website/update/${id}`,{prompt:text},{withCredentials:true})
            console.log("update website",result)
            setMessages((prev)=>[...prev,{role:"ai",content:result.data.message}])
            setCode(result.data.code)
            setupdateLoading(false)
        } catch (error) {
            setupdateLoading(false)
            console.log(error)
        }
    }

    const handleDeploy=async()=>{
        try {
          const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/website/deploy/${website._id}`,{withCredentials:true})
          window.open(`${result.data.url}`,"_blank")
        } catch (error) {
          console.log(error)
        }
      }

    useEffect(()=>{
        if(!updateLoading) return
       const i = setInterval(()=>{
            setthinkingIndex((i)=>(i+1)%thinkingSteps.length)
        },1200)

        return()=>clearInterval(i)
    },[updateLoading])

    useEffect(()=>{
        const handleGetWebsie=async()=>{
            try {
                const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/website/get-by-id/${id}`,{withCredentials:true})
                console.log("editor generate website",result)
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
            }
        }
        handleGetWebsie()
    },[id])

    useEffect(()=>{
        if(!iframeRef.current || !code) return
        const blob = new Blob([code],{type:"text/html"})
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return ()=>URL.revokeObjectURL(url)
    },[code])

    if(error){
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }

    if(!website){
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }
  return (
    <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
      <aside className='hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80'>
        <Header/>
        {/* chat */}
        <>
        <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
            {messages.map((m,i)=>(
                <div 
                key={i}
                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? 'bg-white text-black' : "bg-white/5 border border-white/10 text-zinc-200"}`}>
                        {m.content}
                    </div>
                </div>
            ))}

            {updateLoading &&
            <div className='max-w-[85%] mr-auto'>
                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>
                    {thinkingSteps[thinkingIndex]}
                </div>
            </div>}
        </div>

        <div className='p-3 border-t border-white/10'>
            <div className='flex gap-2'>
                <input type="text" placeholder='Describe Changes...' onChange={(e)=>{setPrompt(e.target.value)}} value={prompt} className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none'/>
                <button onClick={()=>{handleUpdate()}} disabled={updateLoading} className='px-4 py-3 rounded-2xl bg-white text-black'><Send/></button>
            </div>
        </div>
        </>
      </aside>

      <div className='flex-1 flex flex-col'>
        <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
            <span className='text-xs text-zinc-400'>Live Preview</span>
            <div className='flex gap-2'>
                {website.deployed ? "" :<button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'>
                    <Rocket onClick={()=>{handleDeploy()}} size={14}/> Deploy</button>}
                    <button className='p-2 lg:hidden' onClick={()=>{setShowChat(true)}}><MessageSquare size={18}/></button>
                    <button className='p-2'onClick={()=>{setShowCode(true)}}><Code2 size={18}/></button>
                    <button className='p-2' onClick={()=>{setShowFullpreview(true)}}><Monitor size={18}/></button>
            </div>
        </div>
        <iframe ref={iframeRef} className='flex-1 w-full bg-white'></iframe>
      </div>

        {/* small device chat */}
        <AnimatePresence>
            {showChat && (
                <motion.div 
                initial={{y:"100%"}}
                animate={{y:0}}
                exit={{y:"100%"}}
                className='fixed inset-0 z-[9999] bg-black flex flex-col '>
                 <Header/>
                 <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m,i)=>(
                            <div 
                            key={i}
                            className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? 'bg-white text-black' : "bg-white/5 border border-white/10 text-zinc-200"}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {updateLoading &&
                        <div className='max-w-[85%] mr-auto'>
                            <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>
                                {thinkingSteps[thinkingIndex]}
                            </div>
                        </div>}
                    </div>

                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input type="text" placeholder='Describe Changes...' onChange={(e)=>{setPrompt(e.target.value)}} value={prompt} className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none'/>
                            <button onClick={()=>{handleUpdate()}} disabled={updateLoading} className='px-4 py-3 rounded-2xl bg-white text-black'><Send/></button>
                        </div>
                    </div>
                    </>
                </motion.div>
            )}
        </AnimatePresence>

        {/* code preview */}
      <AnimatePresence>
        {showCode && (
            <motion.div
            initial={{x:"100%"}}
            animate={{x:0}}
            exit={{x:"100%"}}
            className='fixed inset-y-0 right-0 w-full lg:w-[40%] z-[9999] bg-[#1e1e1e] flex flex-col'>
                <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                    <span className='text-sm font-medium'>
                        index.html</span>
                        <button onClick={()=>{setShowCode(false)}}>
                            <X size={18}/></button>
                </div>
                <Editor
                height="100%"
                language='html'
                theme="vs-dark"
                value={code}
                onChange={(v)=>{setCode(v)}}
            />
            </motion.div>
        )}
      </AnimatePresence>

            {/* full preview */}
        <AnimatePresence>
            {showFullpreview && (
                <motion.div className='fixed inset-0 z-[9999] bg-black'>
                    <iframe className='w-full h-full b-white' srcDoc={code}/>
                    <button onClick={()=>{setShowFullpreview(false)}} className='absolute mt-1 top-4 right-4 p-2 bg-black/70 rounded-lg hover:bg-zinc-700'>
                        <X size={20}/></button>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  )
  function Header(){
    return (
        <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
            <span className='font-semibold truncate'>{website.title}</span>
            <button onClick={()=>{setShowChat(false)}} className='lg:hidden'><X size={18}/></button>
        </div>
    )
}

}

export default WebsiteEditor


