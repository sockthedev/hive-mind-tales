import React from "react"

export type ScrollToMeProps = { className?: string; scrollId: string }

export const ScrollToMe: React.FC<ScrollToMeProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const prevScrollId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (prevScrollId.current && prevScrollId.current !== props.scrollId) {
      ref.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevScrollId.current = props.scrollId
  }, [props.scrollId])

  return <div className={props.className} key={props.scrollId} ref={ref} />
}
