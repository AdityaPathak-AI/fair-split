import { cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../lib/utils'

const buttonVariance = cva(
     "rounded-md outline-none text-base font-medium w-full flex items-center justify-center  transition-all duration=300",
     {
         variants:{
             variant:{
                 fill:"bg-slate-700 text-white hover:bg-slate-800"
             },
             size:{
                 lg:"py-2 px-4",
                 sm:"py-1.5 px-4"
             }
         },
         defaultVariants:{
             size:"lg",
             variant:"fill"
         }
     }
)
const Button = ({children,className,variant,size,...rest}) => {
  return (
    <button className={cn(buttonVariance({variant,size,className}))} {...rest}>
        {children}
    </button>
  )
}

export default Button