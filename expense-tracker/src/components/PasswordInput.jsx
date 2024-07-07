import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { Eye, EyeOffIcon } from 'lucide-react'

const PasswordInput = ({ className, type, ...props }) => {
    const [showPass, setShowPass] = useState(false)
    return (
        <div className="relative">
            <input {...props} type={showPass ? "text" :"password"} className={cn('w-full outline-none border py-2 px-4 border-slate-600 rounded-md text-sm font-medium text-white bg-transparent', className)} />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' onClick={()=>setShowPass(!showPass)}>
                 {
                  !showPass ? <Eye className='w-5 h-5 text-white'/> : <EyeOffIcon className='w-5 h-5 text-white'/>
                 }
            </span>
        </div>
    )
}

export default PasswordInput