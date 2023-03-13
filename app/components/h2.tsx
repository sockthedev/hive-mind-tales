import React from "react"

export type H2Props = {
  children: React.ReactNode
}

export const H2: React.FC<H2Props> = ({ children }) => {
  return (
    <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  )
}
