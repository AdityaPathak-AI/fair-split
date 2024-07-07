import React from 'react'
import { cn } from '../lib/utils'

const Input = ({className,type = "text",...props}) => {
  return (
    <input {...props} type={type} className={cn('w-full outline-none border py-2 px-4 border-slate-600 rounded-md text-sm font-medium text-white bg-transparent',className)}/>
  )
}

export default Input