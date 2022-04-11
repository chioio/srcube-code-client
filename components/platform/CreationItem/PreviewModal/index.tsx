import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

import { Transition, Dialog } from '@headlessui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'

import { userProfileState } from '@lib/store/atoms'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Creation, Star, Comment, Follow } from '@lib/api/schema'

import { CommentPanel } from './CommentPanel'
import { StarUsers } from './StarUsers'
import { ShareLinks } from './ShareLinks'
import { PreviewPanel } from './PreviewPanel'

interface PreviewModalProps extends Modal {
  creationId: string
}

type GetCreationVariables = {
  creationId: string
}

type GetCreationOutput = {
  creation: Creation
}

const GET_CREATION_DETAIL = gql`
  query Query($creationId: String!) {
    creation(_id: $creationId) {
      _id
      title
      code {
        html
        javascript
        css
      }
      stars
      comments
      author
      createdAt
      updatedAt
    }
  }
`

type RelationCreationVariables = {
  creationId: string
  author?: string
}

type RelationCreationOutput = {
  user: { avatar: string }
  comments: Comment[]
  stars: Star[]
}

const AUTHOR_QUERY = gql`
  query AuthorQuery($author: String!) {
    user(username: $author) {
      avatar
    }
  }
`

type GetFollowVariables = {
  username: string
  following: string
}

type GetFollowOutput = {
  follow: {
    _id: string
  }
}

const GET_FOLLOW_QUERY = gql`
  query GetFollow($username: String!, $following: String!) {
    follow(username: $username, following: $following) {
      _id
    }
  }
`

type FollowVariables = {
  username: string
  following: string
}

type FollowOutput = {
  createFollow: Follow
}

const FOLLOW_MUTATION = gql`
  mutation CreateFollow($following: String!, $username: String!) {
    createFollow(following: $following, username: $username) {
      _id
      username
      following
    }
  }
`

type UnfollowVariables = {
  username: string
  following: string
}

type UnfollowOutput = boolean

const UNFOLLOW_MUTATION = gql`
  mutation RemoveFollow($following: String!, $username: String!) {
    removeFollow(following: $following, username: $username)
  }
`

export const PreviewModal: React.VFC<PreviewModalProps> = ({ isActive, onClose, creationId }) => {
  const [creation, setCreation] = useState<Creation>()

  const router = useRouter()

  const [isFollowed, setIsFollowed] = useState(false)

  const { username } = useRecoilValue(userProfileState)

  const { data } = useQuery<GetCreationOutput, GetCreationVariables>(GET_CREATION_DETAIL, {
    variables: {
      creationId,
    },
    onCompleted: (data) => {
      if (data) {
        setCreation(data.creation)
      }
    },
  })

  const [getFollow] = useLazyQuery<GetFollowOutput, GetFollowVariables>(GET_FOLLOW_QUERY, {
    variables: {
      username,
      following: data?.creation.author || '',
    },
    onCompleted: (data) => {
      if (data.follow) {
        setIsFollowed(true)
      } else {
        setIsFollowed(false)
      }
    },
  })

  const [relationQuery, relData] = useLazyQuery<RelationCreationOutput, RelationCreationVariables>(AUTHOR_QUERY, {
    variables: {
      creationId,
      author: data && data.creation!.author,
    },
  })

  const [follow] = useMutation<FollowOutput, FollowVariables>(FOLLOW_MUTATION, {
    variables: {
      username: username,
      following: data?.creation.author || '',
    },
    onCompleted: (data) => {
      if (data) {
        data.createFollow._id && setIsFollowed(true)
      }
    },
  })

  const [unFollow] = useMutation<UnfollowOutput, UnfollowVariables>(UNFOLLOW_MUTATION, {
    variables: {
      username,
      following: data?.creation.author || '',
    },
    onCompleted: (data) => {
      if (data) {
        setIsFollowed(false)
      }
    },
  })

  const handleFollow = () => {
    isFollowed ? unFollow() : follow()
  }

  useEffect(() => {
    if (data?.creation) {
      relationQuery()
      getFollow()
    }
  }, [data])

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
                  <img src={relData.data?.user.avatar} alt="" className="bg-white row-span-2 w-12 rounded-md" />
                  <h1 className="text-2xl leading-none font-bold">{data?.creation.title}</h1>
                  <div className="flex space-x-2 space-y-1 align-middle">
                    <h2 className="text-base">@{data?.creation.author}</h2>
                    <button
                      onClick={handleFollow}
                      className={`px-2 space-x-1 text-sm rounded-md ${
                        isFollowed ? 'bg-green-600' : 'bg-blue-600'
                      } text-white active:ring-2 active:ring-green-600/40`}
                    >
                      <FontAwesomeIcon icon={isFollowed ? faCheck : faPlus} />
                      <span>{isFollowed ? 'Unfollow' : 'Follow'}</span>
                    </button>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex py-1 space-x-3">
                  <button
                    onClick={() =>
                      router.push(
                        '/[username]/creation/[_id]',
                        `/${data?.creation.author}/creation/${data?.creation._id}`,
                      )
                    }
                    className={`px-3 space-x-2 rounded-md bg-blue-600 text-white active:ring-4 active:ring-blue-600/40`}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>View & Edit</span>
                  </button>
                </div>
              </header>

              <main className="p-4 bg-gray-200/60 rounded-b-2xl">
                {/* Preview */}
                <PreviewPanel creation={data?.creation} />
                {/* Information */}
                <div className="mt-4 p-4 grid grid-cols-[minmax(0,35em)_minmax(0,240px)] gap-8">
                  {/* Comment */}
                  <CommentPanel creationId={data?.creation._id} />
                  <aside className="flex flex-col space-y-3">
                    <ShareLinks author={data?.creation.author} creationId={data?.creation._id} />
                    {/* Create On */}
                    <div className="">
                      <dt className="text-xs text-gray-400">Create on</dt>
                      <dd>
                        {new Date(data?.creation.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </dd>
                    </div>
                    {/* Update On */}
                    <div className="">
                      <dt className="text-xs text-gray-400">Update on</dt>
                      <dd className="font-bold">
                        {new Date(data?.creation.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </dd>
                    </div>
                    <StarUsers creationId={data?.creation._id} />
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
