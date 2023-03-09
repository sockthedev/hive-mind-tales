import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Combobox } from "@headlessui/react"
import { clsx } from "clsx"
import { useState } from "react"

export type ComboBoxOption = { name: string; value: string }

export type ComboBoxProps = {
  label: string
  options: ComboBoxOption[]
  onChange: (value: ComboBoxOption) => void
  value?: ComboBoxOption
}

export const ComboBox: React.FC<ComboBoxProps> = (props) => {
  const [query, setQuery] = useState("")

  const filteredOptions =
    query === ""
      ? props.options
      : props.options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={props.value} onChange={props.onChange}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {props.label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(selectedOption: ComboBoxOption) => {
            return selectedOption.name
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <FontAwesomeIcon
            icon={faChevronDown}
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-indigo-600 text-white" : "text-gray-900",
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={clsx(
                        "block truncate",
                        selected && "font-semibold",
                      )}
                    >
                      {option.name}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-indigo-600",
                        )}
                      >
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
