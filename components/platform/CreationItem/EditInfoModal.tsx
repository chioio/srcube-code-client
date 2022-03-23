import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface EditInfoModalProps extends Modal {}

export const EditInfoModal: React.VFC<EditInfoModalProps> = ({ isActive, onClose }) => {
  return (
    <Transition appear show={isActive} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
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
                <Dialog.Title as="h2" className="flex-grow text-2xl font-extrabold leading-6 text-gray-900">
                  Creation Information
                </Dialog.Title>
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="relative bottom-4 left-4 w-8 h-8 rounded-full outline-none active:bg-gray-900/5"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </header>

              <main className="flex flex-col px-3 pt-4">
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
                <button
                  onClick={onClose}
                  className="mt-2 py-1.5 rounded-md text-white bg-blue-600 active:ring-4 active:ring-blue-600/40"
                >
                  Apply & Close
                </button>
              </main>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
