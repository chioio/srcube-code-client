import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

interface DeleteModalProps extends Modal {
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const DeleteModal: React.VFC<DeleteModalProps> = ({ isActive, onConfirm, onClose }) => {
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
            <div className="inline-block mt-14 w-full max-w-xl p-4 my-8 border-[10px] border-red-500 rounded-2xl shadow-inner drop-shadow-lg overflow-hidden text-left align-middle transition-all transform bg-gray-50">
              <header className="flex">
                <Dialog.Title as="h2" className="flex-grow text-3xl font-extrabold leading-6 text-gray-900">
                  Delete Confirmation
                </Dialog.Title>
              </header>

              <main className="px-3 pt-4">
                <p>Here's what happens when you delete a Creation: </p>
                <ul role="list" className="my-2 marker:text-black leading-5 list-disc pl-5 space-y-3">
                  <li>The stars, tags, and comments are permanently deleted and cannot be restored.</li>
                  <li>The user that stars your creation will disappear.</li>
                </ul>

                <button
                  onClick={onConfirm}
                  className="inline-block mt-2 mr-2.5 px-3 py-1.5 rounded-md text-white bg-red-500 active:ring-4 active:ring-red-500/40"
                >
                  I understand, delete my Creation
                </button>
                <button
                  onClick={onClose}
                  className="inline-block mt-3 px-2 py-1.5 rounded-md text-white bg-gray-400 active:ring-4 active:ring-gray-400/40"
                >
                  Cancel
                </button>
              </main>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
