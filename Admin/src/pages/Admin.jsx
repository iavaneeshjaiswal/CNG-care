import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Adminlist from '../components/adminlist'

export default function Admin() {
  const [admins, setAdmins] = useState(true)
  return (
    <div className="flex gap-3 w-full">
    <Navbar />
    
    {admins?<Adminlist />: <div className='flex justify-center w-full h-screen items-center text-red-600'> <p>Auth Failed : Only super admin can see this.</p></div> }
    </div>
  )
}
