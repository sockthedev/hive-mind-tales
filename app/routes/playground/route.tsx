import React from "react"
import ReactTextareaAutosize from "react-textarea-autosize"

export default function PlaygroundRoute() {
  const containerRef = React.useRef<HTMLLabelElement>(null)
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  return (
    <>
      <h1>Playground</h1>
      <h2>Native Control</h2>
      <label
        ref={containerRef}
        className="relative inline-grid items-stretch align-top text-lg after:invisible after:col-start-1 after:col-end-auto after:row-start-2 after:row-end-auto after:w-full after:min-w-[1em] after:resize-none after:appearance-none after:whitespace-pre-wrap after:border-none after:bg-none after:font-inherit after:content-[attr(data-value)]"
      >
        <textarea
          ref={textAreaRef}
          className="col-start-1 col-end-auto row-start-2 row-end-auto m-0 w-full resize-none appearance-none whitespace-pre-wrap p-0 text-lg"
          placeholder="Put stuff in me"
          onInput={() => {
            containerRef.current!.setAttribute(
              "data-value",
              textAreaRef.current!.value,
            )
          }}
        />
      </label>
      <h2>Editable Content</h2>
      <span className="input" role="textbox" contentEditable>
        99
      </span>
      <h2>React Textarea Autosize</h2>
      <ReactTextareaAutosize
        className="w-full scroll-m-20 border-0 border-b border-transparent bg-transparent p-0 text-3xl font-extrabold tracking-tight shadow-none outline-none focus:border-b-blue-600 focus:ring-0 lg:text-5xl"
        placeholder="Your vibe in here"
      />
      What is going on here
    </>
  )
}
