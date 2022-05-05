import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { faCheck, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition, Dialog } from '@headlessui/react'
import { BASE_URL } from '@lib/utils'
import { CreationPreview } from '../CreationPreview'
import { CreationComment } from '../CreationComment'
import { CreationShareLink } from '../CreationShareLink'
import CodeEditorProvider from '@lib/context/CodeEditorContext'
import { useAuth } from '@lib/context/AuthContext'
import { IModal } from 'typings'
import httpCsr from '@lib/utils/http-csr'

interface IPreviewModal extends IModal {
  creation: any
}

export const PreviewModal: React.FC<IPreviewModal> = ({
  creation,
  opened,
  onClose,
}) => {
  const { whoAmI } = useAuth()

  const router = useRouter()

  const [followedId, setFollowedId] = useState(false)

  useEffect(() => {
    const fetchFollowed = async () => {
      const { data, status } = await httpCsr.get(
        `/follow/is-followed?creation_id=${creation.id}`
      )
      if (status === 200) {
        setFollowedId(data)
      }
    }

    whoAmI && fetchFollowed()
  }, [whoAmI])

  return (
    <Transition appear show={opened} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="px-4">
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
          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span
            className="inline h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="block mx-auto w-full max-w-4xl pt-4 my-20 align-middle transform bg-gray-50 shadow-xl rounded-2xl">
              <Dialog.Title
                as="header"
                className="flex px-4 pb-3 border-b shadow-md bg-gray-50"
              >
                <div className="-ml-8 h-fit flex-1 flex items-center space-x-3">
                  <img
                    src={`${BASE_URL}/${creation.owner.profile.avatar}`}
                    alt=""
                    className="inline-block bg-white w-14 h-14 shadow rounded-md"
                  />
                  <div className="flex-1 flex flex-col">
                    <h1 className="text-left text-2xl leading-9 font-bold">
                      {creation.title}
                    </h1>
                    <div className="flex space-x-2 h-fit space-y-1 align-middle">
                      <h2 className="h-fit text-base">
                        @{creation.owner.username}
                      </h2>
                      {whoAmI?.id !== creation.owner_id && (
                        <button
                          onClick={() => {}}
                          className={`px-2 space-x-1 h-fit text-sm rounded-md ${
                            followedId ? 'bg-green-600' : 'bg-orange-500'
                          } text-white active:ring-2 active:ring-green-600/40`}
                        >
                          <FontAwesomeIcon
                            icon={followedId ? faCheck : faPlus}
                          />
                          <span>{followedId ? 'Unfollow' : 'Follow'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex py-1 space-x-3">
                    <button
                      onClick={() =>
                        router.push(
                          '/[username]/creation/[_id]',
                          `/${creation.owner.username}/creation/${creation.id}`
                        )
                      }
                      className={`px-3 py-1.5 space-x-2 rounded-md bg-blue-600 text-white hover:bg-blue-600/90 focus:ring-4 focus:ring-blue-600/40 active:bg-blue-700 active:shadow-md`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>View & Edit</span>
                    </button>
                  </div>
                </div>
              </Dialog.Title>

              <main className="p-4 bg-gray-200/60 rounded-b-2xl">
                {/* Preview */}
                <CodeEditorProvider>
                  <CreationPreview creation={creation} />
                </CodeEditorProvider>

                {/* Information */}
                <div className="mt-4 p-4 grid grid-cols-[minmax(0,35em)_minmax(0,240px)] gap-8">
                  <CreationComment creationId={creation.id} />
                  <aside className="flex flex-col space-y-3">
                    <CreationShareLink
                      owner={creation.owner.username}
                      creationId={creation.id}
                    />
                    {/* Create On */}
                    <div className="text-left">
                      <dt className="text-xs text-gray-400">Create on</dt>
                      <dd>
                        {new Date(creation.created_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          }
                        )}
                      </dd>
                    </div>
                    {/* Update On */}
                    <div className="text-left">
                      <dt className="text-xs text-gray-400">Update on</dt>
                      <dd className="font-bold">
                        {new Date(creation.updated_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          }
                        )}
                      </dd>
                    </div>
                    {/* <StarUsers creationId={data?.creation._id} /> */}
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
