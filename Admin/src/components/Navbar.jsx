import React from 'react'
import logo from '../assets/logo.png'
import {NavLink} from 'react-router-dom'

export default function Navbar() {
    const links = [
        {
            id: 1,
            image: "home",
            path: "/",
            text: "Home"
        },
        {
            id: 2,
            image: "user",
            path: "/users",
            text: "Users"
        },
        {
            id: 3,
            image: "cart",
            path: "/products",
            text: "Products"
        },
        {
            id: 4,
            image: "admin",
            path: "/admins",
            text: "Admins"
        },
        {
            id: 6,
            image: "logout",
            path: "",
            text: "logout"
        }
    ]


  return (
    <nav style={{background: '#FC370F'} } className='flex w-1/6 flex-col justify-start gap-6 items-center  ' >
        <div className="logo overflow-hidden">
        <NavLink to={"/"}>{<img src={logo} className='w-24 scale-150'/>  }</NavLink>
        </div>
        <hr className='bg-white w-full'/>
        <div className="links w-full h-screen flex gap-4 flex-col items-center">       
            <ul className='flex flex-col gap-6 text-white text-md'>
                {links.map((link) => {
                    return (
                        <li key={link.id}>
                            <NavLink to={link.path} className='flex gap-2 items-center'>
                            <img src={`src/assets/${link.image}.svg`} className='w-5'/>
                            <p className='text-lg'>{link.text}</p>
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    </nav>
  )
}
