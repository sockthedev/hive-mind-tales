import React from "react"

export type H3Props = {
  children: React.ReactNode
}

export const H3: React.FC<H3Props> = ({ children }) => {
  return (
    <h2 className="mt-8 scroll-m-20 text-2xl font-bold tracking-tight">
      {children}
    </h2>
  )
}
