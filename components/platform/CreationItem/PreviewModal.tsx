import { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import { Transition, Dialog } from '@headlessui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPlus } from '@fortawesome/free-solid-svg-icons'

import { userProfileState } from '@lib/store/atoms'
import { faEdit, faStar } from '@fortawesome/free-regular-svg-icons'

interface PreviewModalProps extends Modal {}

const styles = {
  action: {
    modal: 'rounded-md bg-blue-600 text-white active:ring-4 active:ring-blue-600/40',
    lang: 'px-3 py-0.5 rounded-t-sm font-medium border-b-4 border-gray-400 bg-gray-300',
    preview: 'px-3 py-0.5 rounded-b-sm text-xs font-medium border-t-4 border-gray-400 bg-gray-300',
  },
}

export const PreviewModal: React.VFC<PreviewModalProps> = ({ isActive, onClose }) => {
  const profile = useRecoilValue(userProfileState)
  return (
    <Transition appear show={isActive} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-400/30 backdrop-blur-sm" />
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
            <div className="mt-28 mx-auto w-full max-w-3xl pt-4 my-8 align-middle transform bg-gray-50 shadow-xl rounded-2xl">
              <header className="flex px-4 pb-3 border-b shadow-md">
                <div className="-ml-8 flex-grow grid grid-cols-[minmax(3rem,auto)_1fr] grid-rows-2 space-x-3">
                  <img src={profile.avatar} alt="" className="row-span-2 w-12 rounded-md" />
                  <h1 className="text-2xl leading-none font-bold">Title</h1>
                  <div className="flex space-x-2 align-middle">
                    <h2 className="text-base">@chioio</h2>
                    <button className="px-2 space-x-1 text-sm rounded-md bg-green-600 text-white active:ring-2 active:ring-green-600/40">
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Follow</span>
                    </button>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex py-1 space-x-3">
                  <button className={`px-3 ${styles.action.modal}`}>
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                  <button className={`px-3 space-x-2 ${styles.action.modal}`}>
                    <FontAwesomeIcon icon={faEdit} />
                    <span>View & Edit</span>
                  </button>
                </div>
              </header>

              <main className="p-4 bg-gray-200/60 rounded-b-2xl">
                {/* Preview */}
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <div className="space-x-0.5">
                      <button className={`${styles.action.lang}`}>HTML</button>
                      <button className={`${styles.action.lang}`}>CSS</button>
                      <button className={`${styles.action.lang}`}>JAVASCRIPT</button>
                    </div>
                    <button className={`${styles.action.lang}`}>Result</button>
                  </div>

                  {/* Panel */}
                  <div className="w-full h-72 bg-gray-900"></div>
                  <div className="flex justify-between">
                    <div className="space-x-0.5">
                      <button className={`${styles.action.preview}`}>1.0</button>
                      <button className={`${styles.action.preview}`}>0.5</button>
                      <button className={`${styles.action.preview}`}>0.25</button>
                    </div>
                    <button className={`${styles.action.preview}`}>Refresh</button>
                  </div>
                </div>
                {/* Information */}
                <div className="mt-4 p-4 grid grid-cols-[minmax(0,35em)_minmax(0,240px)] gap-8">
                  {/* Comment */}
                  <div className="space-y-4">
                    <div className="relative p-3 bg-white rounded-lg overflow-hidden">
                      <textarea
                        placeholder="Want to know how Tenn did this? Ask a question! 
                        Feeling inspired? Let Tenn know! 
                        Want to share how you used this Pen? 
                        Give the creator a confidence boost!"
                        rows={5}
                        className="p-0 w-full rounded-md outline-none border-none focus:ring-0 resize-none"
                      />
                      <button className="float-right self-end px-4 py-1 rounded-md bg-gray-200">Comment</button>
                    </div>
                    <div className="">
                      <p>
                        <strong>No Comments</strong>
                        <br />
                        You can be the first!
                      </p>
                    </div>
                  </div>
                  <aside className="flex flex-col space-y-3">
                    <div className="py-2 px-3 space-x-3 bg-white rounded-md">
                      <span className="font-semibold text-gray-400/60">SHARE</span>
                      <button className="px-2 py-1 rounded space-x-1 text-sm text-semibold bg-gray-200">
                        <FontAwesomeIcon icon={faLink} />
                        <span>CopyLink</span>
                      </button>
                    </div>
                    {/* Create On */}
                    <div className="">
                      <dt className="text-xs text-gray-400">Create on</dt>
                      <dd>June 30, 2021</dd>
                    </div>
                    {/* Update On */}
                    <div className="">
                      <dt className="text-xs text-gray-400">Update on</dt>
                      <dd className="font-bold">February 24, 2022</dd>
                    </div>
                  </aside>
                </div>
              </main>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
