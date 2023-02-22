import React from "react"

export type H1Props = {
  children: React.ReactNode
}

export const H1: React.FC<H1Props> = ({ children }) => {
  return (
    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  )
}
