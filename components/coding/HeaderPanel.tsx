import Link from 'next/link'
import { useRecoilState } from 'recoil'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt as fasPencilAlt,
  faCloud as fasCloud,
  faListAlt as fasListAlt,
  faTimes as fasTimes,
} from '@fortawesome/free-solid-svg-icons'

import { viewDirectionState, workState } from '@lib/store/atoms'
import { Dialog, Transition } from '@headlessui/react'
import { LogoIcon, UserMenu } from '@components/common'

export const HeaderPanel: React.VFC<any> = () => {
  return (
    <header className="flex items-center px-4 py-2 bg-white dark:bg-gray-900/90">
      <Link href="/" passHref>
        <a>
          <LogoIcon />
        </a>
      </Link>
      {/* Work Info */}
      <WorkTitle />
      {/* Work Control */}
      <div className="flex">
        <SaveButton />
        <WorkDetails />
        <ViewSwitcher />
      </div>
      {/* User */}
      <UserMenu />
    </header>
  )
}

export const SaveButton: React.VFC<any> = () => {
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('SAVE')
  }
  return (
    <button
      onClick={handleSave}
      className="mr-2.5 px-4 rounded-md leading-10 text-white bg-blue-600 active:bg-blue-700 active:shadow-md active:text-gray-100"
    >
      <FontAwesomeIcon icon={fasCloud} className="mr-1.5" />
      <span className="text-lg font-md">Save</span>
    </button>
  )
}

export const WorkTitle: React.VFC<any> = () => {
  const [isEditable, setIsEditable] = useState<boolean>(false)

  const [work, setWork] = useRecoilState(workState)

  return (
    <div className="flex-grow ml-3">
      <h2>
        {isEditable ? (
          <input
            id="editable-title-input"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              setIsEditable(false)
              e.target.value && setWork({ title: e.target.value, author: work.author, code: work.code })
            }}
            className="text-lg font-bold outline-none"
            autoFocus
          />
        ) : (
          <>
            <span className="text-lg font-bold">{work.title}</span>
            <FontAwesomeIcon
              icon={fasPencilAlt}
              onClick={() => {
                setIsEditable(true)
              }}
              className="ml-1 text-sm cursor-pointer hover:transition hover:-rotate-12 hover:opacity-60"
            />
          </>
        )}
      </h2>
      <p className="text-sm font-medium opacity-40">{work.author}</p>
    </div>
  )
}

export const WorkDetails: React.VFC<any> = () => {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={openModal}
        className="mr-2.5 px-4 rounded-md leading-10 text-white bg-blue-600 active:bg-blue-700 active:shadow-md active:text-gray-100"
      >
        <FontAwesomeIcon icon={fasListAlt} className="mr-1.5" />
        <span className="text-lg font-md">Details</span>
      </button>
      {/* Work Detail Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block mt-28 w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform border-2 bg-gray-50 shadow-xl rounded-2xl">
                <header className="flex">
                  <Dialog.Title as="h3" className="flex-grow text-xl font-bold leading-6 text-gray-900">
                    WORK DETAILS
                  </Dialog.Title>
                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="relative bottom-4 left-4 w-8 h-8 rounded-full outline-none active:bg-gray-900/5"
                  >
                    <FontAwesomeIcon icon={fasTimes} />
                  </button>
                </header>

                <main>
                  <div className="flex flex-col px-4 pt-4">
                    <label className="text-md font-semibold leading-8">Title: </label>
                    <input placeholder="Typing the work title..." className="mb-2 px-2 py-1 border rounded-md" />
                    <label className="text-md font-semibold leading-8">Descriptions: </label>
                    <textarea
                      rows={3}
                      placeholder="Typing the work description..."
                      className="mb-2 px-2 py-1 border border-gray-200 rounded-md resize-none"
                    />
                    <label className="text-md font-semibold leading-8">Tags: </label>
                    <input placeholder="Typing the work title..." className="mb-4 px-2 py-1 border rounded-md" />
                    <button onClick={closeModal} className="mt-2 py-1.5 rounded-md text-white bg-blue-600">
                      Apply & Close
                    </button>
                  </div>
                </main>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

interface ViewLayoutIconProps {
  direction?: 'top' | 'left' | 'right'
  color?: string
}

const ViewLayoutIcon: React.VFC<ViewLayoutIconProps> = ({ direction = 'top', color = 'white' }) => (
  <svg
    viewBox="0 0 20 20"
    className={`w-4 h-4 ${direction === 'left' ? '-rotate-90' : direction === 'right' ? 'rotate-90' : ''}`}
  >
    <path
      className={`${color === 'white' ? 'fill-white' : 'fill-black'}`}
      d="M0 9.002C0 8.45.455 8 .992 8h18.016c.548 0 .992.456.992 1.002v9.996c0 .553-.455 1.002-.992 1.002H.992C.444 20 0 19.544 0 18.998V9.002zm0-8C0 .45.451 0 .99 0h4.02A.99.99 0 016 1.003v4.994C6 6.551 5.549 7 5.01 7H.99A.99.99 0 010 5.997V1.003zm7 0C7 .45 7.451 0 7.99 0h4.02A.99.99 0 0113 1.003v4.994C13 6.551 12.549 7 12.01 7H7.99A.99.99 0 017 5.997V1.003zm7 0C14 .45 14.451 0 14.99 0h4.02A.99.99 0 0120 1.003v4.994C20 6.551 19.549 7 19.01 7h-4.02A.99.99 0 0114 5.997V1.003z"
    ></path>
  </svg>
)

export const ViewSwitcher: React.VFC<any> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const selectionRef = useRef<HTMLDivElement>(null)

  const [viewDirection, setViewDirection] = useRecoilState(viewDirectionState)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation()
      selectionRef.current && !selectionRef.current.contains(e.target as HTMLElement) && setIsOpen(false)
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
        <ViewLayoutIcon direction={viewDirection} />
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
          <h3 className="leading-10 text-black text-md text-right font-semibold">Change View</h3>
          <div className="flex-grow flex items-center justify-between">
            <button
              onClick={() => setViewDirection('left')}
              className={`px-6 py-2 border rounded-l-md ${viewDirection === 'left' && 'bg-gray-200'}`}
            >
              <ViewLayoutIcon color="black" direction="left" />
            </button>
            <button
              onClick={() => setViewDirection('top')}
              className={`px-6 py-2 border border-r-0 border-l-0 ${viewDirection === 'top' && 'bg-gray-200'}`}
            >
              <ViewLayoutIcon color="black" direction="top" />
            </button>
            <button
              onClick={() => setViewDirection('right')}
              className={`px-6 py-2  border rounded-r-md ${viewDirection === 'right' && 'bg-gray-200'}`}
            >
              <ViewLayoutIcon color="black" direction="right" />
            </button>
          </div>
        </Transition>
      </div>
    </div>
  )
}
