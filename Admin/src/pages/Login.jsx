import React from 'react'
import logo from '../assets/logo.png'

export default function Login() {

    return (
        <div className='W-full h-screen flex justify-center items-center'>
            <div className="flex flex-col justify-center items-center gap-3 w-80 h-96 py-12 rounded-xl" style={{ background: '#FC370F' }} >
            <div className="logo overflow-hidden flex flex-col justify-center items-center">
                <img src={logo} alt={logo}  className='scale-100'/>
            <h2 className='text-white'>Admin Pannel Login</h2>
            </div>
            <form onSubmit={(e) => {e.preventDefault()}} className='flex gap-5 w-5/6 flex-col justify-center items-center'>
                <input type="text" placeholder='Enter Username' className='p-2 rounded focus:outline-none w-full'/>
                <input type="password" placeholder='Enter Password' className='p-2 rounded focus:outline-none w-full'/>
                <input type="submit" value="Login" className='text-black bg-white p-1 px-4 text-md rounded-lg hover:bg-black hover:text-white transition-all duration-300 cursor-pointer'/>
            </form>
            </div>
        </div>
    )
}
