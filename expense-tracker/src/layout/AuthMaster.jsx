import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthMaster = () => {
  return (
    <div className='auth-wrapper'>
         <main>
              <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
                    <div className="bg-background h-full p-6 lg:p-10">
                          <Outlet/>
                    </div>
                    <div className="auth-bg bg-wrapper h-full lg:block hidden"></div>
              </div>
         </main>
    </div>
  )
}

export default AuthMaster