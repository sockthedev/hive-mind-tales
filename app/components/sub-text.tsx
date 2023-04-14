export type SubTextProps = {
  children: React.ReactNode
}

export const SubText: React.FC<SubTextProps> = (props) => {
  return <p className="text-xs italic text-slate-400">{props.children}</p>
}
