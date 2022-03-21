import { Fragment, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsis,
  faExpand,
  faPenToSquare,
  faStar as fasStar,
  faThumbtack,
  faTimes,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faComment } from '@fortawesome/free-regular-svg-icons'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { SnapshotModal } from './SnapshotModal'

export const Snapshot: React.VFC<any> = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)

  const handleCloseModal = () => setIsOpen(false)

  const handleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log('star!')
  }

  return (
    <>
      <article
        className="group relative p-3.5 -z-0 w-full h-fit
      hover:after:inset-0 hover:after:rounded-2xl
      after:absolute after:top-7 after:left-3.5 after:right-0 after:bottom-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300"
      >
        <div className="relative flex items-center justify-center py-[25%] w-full h-full rounded-xl overflow-hidden bg-red-500 text-white">
          <button
            onClick={handleOpenModal}
            className="hidden group-hover:block absolute top-0 bottom-0 right-0 w-2/5 text-2xl
          after:absolute after:right-0 after:top-0 after:w-full after:h-full after:bg-gradient-to-bl after:from-gray-900/40 after:via-transparent after:to-transparent after:transition-all after:duration-300"
          >
            <FontAwesomeIcon icon={faExpand} className="z-20 absolute top-2.5 right-4" />
          </button>
          Preview
        </div>
        <div className="pl-3.5">
          <div className="flex items-center justify-between ">
            <h2 className="flex-1 mt-0.5 text-lg font-bold">Title</h2>
            <Popover className="inline-block relative">
              <Popover.Button
                as="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  console.log('popover')
                }}
                className="m-1 w-7 h-7 text-lg text-black/30 hover:text-black rounded-full active:bg-black/5"
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute bottom-9 right-0 px-4 py-3 mt-2 w-40 z-50 rounded-lg bg-white shadow-lg">
                  <ul className="">
                    <li className={`p-0.5 border-b`}>
                      <button className=" space-x-2">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <span>Edit infos</span>
                      </button>
                    </li>
                    <li className={`p-0.5 border-b`}>
                      <button className=" space-x-2">
                        <FontAwesomeIcon icon={faThumbtack} />
                        <span>Add to Pins</span>
                      </button>
                    </li>
                    <li className={`p-0.5`}>
                      <button className="space-x-2">
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span>Delete</span>
                      </button>
                    </li>
                  </ul>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
          <div className="space-x-1">
            <button onClick={handleStar} className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5">
              <FontAwesomeIcon icon={fasStar} className="text-yellow-400" />
              <span className="text-sm">10</span>
            </button>
            <button className="space-x-1 px-2 rounded-sm font-semibold hover:bg-black/5">
              <FontAwesomeIcon icon={faComment} />
              <span className="text-sm">4</span>
            </button>
          </div>
        </div>
      </article>
      <SnapshotModal isOpen={isOpen} onClose={handleCloseModal} />
    </>
  )
}
