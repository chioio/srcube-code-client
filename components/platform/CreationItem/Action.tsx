import { Fragment, useState } from 'react'

import { Popover, Transition } from '@headlessui/react'
import {
  faEllipsis,
  faPenToSquare,
  faThumbtack,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DeleteModal } from './DeleteModal'

interface ActionProps {}

export const Action: React.VFC<ActionProps> = () => {
  const [isModalActive, setIsModalActive] = useState(false)

  const handleEditInfo = () => {}

  const handleAddToPin = () => {}

  return (
    <>
      <Popover className="inline-block relative">
        <Popover.Button className="m-1 w-7 h-7 text-lg text-black/30 hover:text-black rounded-full active:bg-black/5">
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
                <button onClick={handleEditInfo} className="w-full space-x-2 text-left">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>Edit info</span>
                </button>
              </li>
              <li className={`p-0.5 border-b`}>
                <button onClick={handleAddToPin} className="w-full space-x-2 text-left">
                  <FontAwesomeIcon icon={faThumbtack} />
                  <span>Add to Pins</span>
                </button>
              </li>
              <li className={`p-0.5`}>
                <button onClick={() => setIsModalActive(true)} className="w-full space-x-2 text-left">
                  <FontAwesomeIcon icon={faTrashCan} />
                  <span>Delete</span>
                </button>
              </li>
            </ul>
          </Popover.Panel>
        </Transition>
      </Popover>
      <DeleteModal isActive={isModalActive} onClose={() => setIsModalActive(false)} />
    </>
  )
}
