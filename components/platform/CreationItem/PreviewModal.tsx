import { Fragment, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { Transition, Dialog } from '@headlessui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faLink, faPlus, faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faEdit, faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { userProfileState } from '@lib/store/atoms'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Creation, Star, Comment, Follow } from '@lib/api/schema'
import { HOSTNAME } from '@lib/constants'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'

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

type GetStarVariables = {
  username: string
  creationId: string
}

type GetStarOutput = {
  star: {
    _id: string
  }
}

const GET_STAR_QUERY = gql`
  query GetStar($username: String!, $creationId: String!) {
    star(username: $username, creationId: $creationId) {
      _id
    }
  }
`

const styles = {
  action: {
    modal: 'rounded-md bg-blue-600 text-white active:ring-4 active:ring-blue-600/40',
    lang: 'px-3 py-0.5 rounded-t-sm font-medium border-b-4 border-gray-400 bg-gray-300',
    preview: 'px-3 py-0.5 rounded-b-sm text-xs font-medium border-t-4 border-gray-400 bg-gray-300',
  },
}

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

  const handleStar = () => {
    // isStared ?
  }

  useEffect(() => {
    if (data?.creation) {
      relationQuery()
      getFollow()
    }
  }, [data])

  useEffect(() => {}, [relData.data])

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
                    className={`px-3 space-x-2 ${styles.action.modal}`}
                  >
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
                  <Comment creationId={data?.creation._id} />
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
                    <Stars creationId={data?.creation._id} />
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

type CommentsVariables = {
  creationId: string
}

type CommentsOutput = {
  comments: Comment[]
}

const COMMENTS_QUERY = gql`
  query Comments($creationId: String!) {
    comments(creationId: $creationId) {
      _id
      updatedAt
      content
      commenter {
        title
        username
        avatar
      }
      creationId
    }
  }
`

type CommentVariables = {
  input: {
    creationId: string
    commenter: string
    content: string
  }
}

type CommentOutput = {
  comment: Comment
}

const COMMENT_MUTATION = gql`
  mutation CommentMutation($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      _id
      creationId
      content
      commenter {
        title
        avatar
        username
      }
      createdAt
      updatedAt
    }
  }
`

interface CommentProps {
  creationId?: string
}

const Comment: React.VFC<CommentProps> = ({ creationId }) => {
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const { username } = useRecoilValue(userProfileState)

  const [comments, setComments] = useState<Comment[]>([])

  const [getComments] = useLazyQuery<CommentsOutput, CommentsVariables>(COMMENTS_QUERY, {
    variables: {
      creationId: creationId || '',
    },
    onCompleted: (data) => {
      if (data) {
        setComments(data.comments)
      }
    },
  })

  const [comment] = useMutation<CommentOutput, CommentVariables>(COMMENT_MUTATION, {
    onCompleted: (data) => {
      if (data) {
        getComments()
      }
    },
  })

  const handleReplay = ({ commenter }: { commenter: string }) => {
    if (commentRef.current) {
      commentRef.current.value = '@' + commenter + ' '
      commentRef.current.focus()
    }
  }

  const handleComment = () => {
    if (commentRef.current) {
      comment({
        variables: {
          input: {
            creationId: creationId || '',
            commenter: username,
            content: commentRef.current.value,
          },
        },
      })
    }
  }

  useEffect(() => {
    getComments()
  }, [creationId])

  useEffect(() => {
    console.log(comments)
  }, [comments])

  return (
    <div className="space-y-4">
      <div className="relative p-3 bg-white rounded-lg overflow-hidden">
        <textarea
          placeholder="Write your comment here..."
          rows={5}
          ref={commentRef}
          className="p-0 w-full rounded-md outline-none border-none focus:ring-0 resize-none"
        />
        <button
          onClick={handleComment}
          className="float-right self-end px-4 py-1 rounded-md bg-gray-200 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100"
        >
          Comment
        </button>
      </div>
      <div className="relative p-4 bg-white rounded-md">
        <p className="text-gray-400 pb-4">
          <strong>{comments?.length || 'No'} Comments</strong>
          {!comments?.length && (
            <>
              <br />
              You can be the first!
            </>
          )}
        </p>
        {comments?.map((item, index) => (
          <div key={index} className="relative flex flex-col">
            {/* Commenter */}
            <div className="relative flex space-x-2 z-30">
              <img
                src={item.commenter.avatar}
                width={40}
                height={40}
                className="w-10 h-10 bg-white rounded-md border-4 border-white"
                alt=""
              />
              <p className="cursor-pointer flex-1">
                <span className="font-bold">{item.commenter.title}</span>
                <span className="text-sm font-semibold text-gray-400">(@{item.commenter.username})</span>
                <dd className="block text-xs font-medium text-gray-400">
                  {new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </dd>
              </p>
              <button
                onClick={() => handleReplay({ commenter: item.commenter.username })}
                className="bg-gray-300 h-fit font-medium text-gray-600 hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-gray-100 px-2 rounded"
              >
                Replay
              </button>
            </div>
            {/* Content */}
            <div className="relative ml-4 px-3 pt-2 pb-8 border-l-2">
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShareLinks: React.VFC<{ author?: string; creationId?: string }> = ({ author, creationId }) => {
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${HOSTNAME}/${author}/creation/${creationId}`)
      .then(() => {
        toast.success('Copy to clipboard success!')
      })
      .catch((err) => {
        toast.success(err)
      })
  }
  return (
    <div className="py-2 px-3 space-x-3 bg-white rounded-md">
      <span className="font-semibold text-gray-400/60">SHARE</span>
      <button onClick={handleCopyLink} className="px-2 py-1 rounded space-x-1 text-sm text-semibold bg-gray-200">
        <FontAwesomeIcon icon={faLink} />
        <span>CopyLink</span>
      </button>
    </div>
  )
}

type GetStarsVariables = {
  creationId: string
}

type GetStarsOutput = {
  stars: Star[]
}

const GET_STARS_QUERY = gql`
  query GetStarsQuery($creationId: String!) {
    stars(creationId: $creationId) {
      _id
      user {
        title
        avatar
        username
      }
    }
  }
`

const Stars: React.VFC<{ creationId?: string }> = ({ creationId }) => {
  const [getStars, { data }] = useLazyQuery<GetStarsOutput, GetStarsVariables>(GET_STARS_QUERY, {
    variables: { creationId: creationId || '' },
  })

  useEffect(() => {
    if (creationId) {
      getStars()
    }
  }, [creationId])
  return (
    <div className="w-full h-fit">
      <h3 className="mt-4 mb-2 space-x-2">
        <FontAwesomeIcon icon={fasStar} className="text-yellow-400" />
        <span>{data?.stars.length || 'No'} Stars</span>
      </h3>

      <div className="flex">
        {data?.stars.map((item) => (
          <Link href={`${HOSTNAME}/${item.user.username}`}>
            <a className="relative group m-0.5">
              <img src={item.user.avatar} className="rounded bg-white w-8 h-8 cursor-pointer" />
              <div className="opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition translate-y-2 absolute top-5 -left-16 -right-16 text-center">
                <div className="px-2 inline-block text-sm space-x-1 font-medium  bg-white rounded text-black">
                  <span className="">{item.user.title}</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
