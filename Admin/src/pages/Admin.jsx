import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Adminlist from '../components/adminlist'

export default function Admin() {
  const [admins, setAdmins] = useState(true)
  return (
    <div className="flex w-full">
    <Navbar/>
    
    {admins?<Adminlist />: <div className='flex justify-center p-3 w-full text-red-600'> <p>Auth Failed : Only super admin can see this.</p></div> }
    </div>
  )
}
