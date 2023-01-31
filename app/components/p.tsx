export type PProps = {
  children: React.ReactNode
}

export const P: React.FC<PProps> = ({ children }) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
}
