import { Transition } from '@headlessui/react'
import { ECodeEditorTheme, useCodeEditor } from '@lib/context/CodeEditorContext'
import { useCoding } from '@lib/context/CodingContext'
import { useEffect, useRef, useState } from 'react'

export enum EViewDirection {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export const ViewSwitcher: React.VFC<any> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const coding = useCoding()

  const { theme, dispatch } = useCodeEditor()

  const selectionRef = useRef<HTMLDivElement>(null)

  const [viewDirection, setViewDirection] = useState({})

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation()
      selectionRef.current &&
        !selectionRef.current.contains(e.target as HTMLElement) &&
        setIsOpen(false)
    }

    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [selectionRef])

  return (
    <div className="relative mr-4">
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          setIsOpen((isOpen) => !isOpen)
        }}
        className="h-full text-white group bg-blue-600 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <ViewLayoutIcon direction={EViewDirection.TOP} />
      </button>
      {/* Selections */}
      <div ref={selectionRef}>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
          className="absolute right-0 top-12 z-10 min-w-fit flex flex-col px-4 pb-4 bg-white border rounded-md shadow-lg"
        >
          <h3 className="leading-10 text-black text-md text-right font-semibold">
            Change View
          </h3>
          <div className="flex-grow flex items-center justify-between">
            <button
              onClick={() =>
                coding.dispatch({
                  type: 'SET_DIRECTION',
                  payload: { direction: EViewDirection.LEFT },
                })
              }
              className={`px-6 py-2 border rounded-l-md ${
                coding.direction === 'left' && 'bg-gray-200'
              }`}
            >
              <ViewLayoutIcon color="black" direction={EViewDirection.LEFT} />
            </button>
            <button
              onClick={() =>
                coding.dispatch({
                  type: 'SET_DIRECTION',
                  payload: { direction: EViewDirection.TOP },
                })
              }
              className={`px-6 py-2 border border-r-0 border-l-0 ${
                coding.direction === 'top' && 'bg-gray-200'
              }`}
            >
              <ViewLayoutIcon color="black" direction={EViewDirection.TOP} />
            </button>
            <button
              onClick={() =>
                coding.dispatch({
                  type: 'SET_DIRECTION',
                  payload: { direction: EViewDirection.RIGHT },
                })
              }
              className={`px-6 py-2  border rounded-r-md ${
                coding.direction === 'right' && 'bg-gray-200'
              }`}
            >
              <ViewLayoutIcon color="black" direction={EViewDirection.RIGHT} />
            </button>
          </div>
          <h3 className="leading-10 text-black text-md text-right font-semibold">
            Editor Theme
          </h3>
          <div className="flex-grow flex items-center justify-between">
            <button
              onClick={() =>
                dispatch({
                  type: 'SET_THEME',
                  payload: { theme: ECodeEditorTheme.GH_LIGHT },
                })
              }
              className={`py-1 flex-1 border rounded-l-md ${
                theme === ECodeEditorTheme.GH_LIGHT && 'bg-gray-200'
              }`}
            >
              Light
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: 'SET_THEME',
                  payload: { theme: ECodeEditorTheme.GH_DARK },
                })
              }
              className={`py-1 flex-1 border rounded-r-md ${
                theme === ECodeEditorTheme.GH_DARK && 'bg-gray-200'
              }`}
            >
              Dark
            </button>
          </div>
        </Transition>
      </div>
    </div>
  )
}

interface ViewLayoutIconProps {
  direction?: EViewDirection
  color?: string
}

const ViewLayoutIcon: React.VFC<ViewLayoutIconProps> = ({
  direction = 'top',
  color = 'white',
}) => (
  <svg
    viewBox="0 0 20 20"
    className={`w-4 h-4 ${
      direction === 'left'
        ? '-rotate-90'
        : direction === 'right'
        ? 'rotate-90'
        : ''
    }`}
  >
    <path
      className={`${color === 'white' ? 'fill-white' : 'fill-black'}`}
      d="M0 9.002C0 8.45.455 8 .992 8h18.016c.548 0 .992.456.992 1.002v9.996c0 .553-.455 1.002-.992 1.002H.992C.444 20 0 19.544 0 18.998V9.002zm0-8C0 .45.451 0 .99 0h4.02A.99.99 0 016 1.003v4.994C6 6.551 5.549 7 5.01 7H.99A.99.99 0 010 5.997V1.003zm7 0C7 .45 7.451 0 7.99 0h4.02A.99.99 0 0113 1.003v4.994C13 6.551 12.549 7 12.01 7H7.99A.99.99 0 017 5.997V1.003zm7 0C14 .45 14.451 0 14.99 0h4.02A.99.99 0 0120 1.003v4.994C20 6.551 19.549 7 19.01 7h-4.02A.99.99 0 0114 5.997V1.003z"
    ></path>
  </svg>
)
