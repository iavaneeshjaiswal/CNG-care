import React from 'react'
import Navbar from '../components/Navbar'
import Userlist from '../components/Userlist'

export default function User() {
  return (
    <div className="flex gap-3 w-full">
      <Navbar />
      <Userlist/>
    </div>

  )
}
