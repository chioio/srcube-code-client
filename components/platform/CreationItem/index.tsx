import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faEllipsis, faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { Action, Actions } from './Actions'
import { Preview } from './Preview'
import { PreviewModal } from './PreviewModal'
import { CreateStarInput, Creation, Star, User } from '@lib/api/schema'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useWindowMounted } from '@lib/hooks'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '@lib/store/atoms'
import { Popover, Transition } from '@headlessui/react'

interface CreationItemProps {
  isCommon?: boolean
  creation: Creation
}

type CreationItemQueryVariables = {
  author: string
  username: string
  creationId: string
}

type CreationItemQueryResponse = {
  stars: Star[]
  user: User
}

const CREATION_ITEM_QUERY = gql`
  query Query($author: String!, $creationId: String!, $username: String) {
    user(username: $author) {
      avatar
    }
    stars(creationId: $creationId, username: $username) {
      _id
      username
    }
  }
`

const STAR_COUNT_QUERY = gql`
  query Query($creationId: String!) {
    stars(creationId: $creationId) {
      _id
    }
  }
`

export const ADD_STAR_MUTATION = gql`
  mutation CreateStar($createStarInput: CreateStarInput!) {
    createStar(createStarInput: $createStarInput) {
      _id
    }
  }
`

export const CANCEL_STAR_MUTATION = gql`
  mutation RemoveStar($removeStarId: String!) {
    removeStar(_id: $removeStarId)
  }
`

export const CreationItem: React.VFC<CreationItemProps> = ({ isCommon = true, creation }) => {
  const isWindowMounted = useWindowMounted()

  const profile = useRecoilValue(userProfileState)

  const [isModalActive, setIsModalActive] = useState(false)

  const [starId, setStarId] = useState('')
  const [starCount, setStarCount] = useState(0)

  const [judgeStared, { data }] = useLazyQuery<CreationItemQueryResponse, CreationItemQueryVariables>(
    CREATION_ITEM_QUERY,
    {
      variables: {
        author: creation.author,
        creationId: creation._id,
        username: profile.username,
      },
      onCompleted: (data) => {
        if (data) {
          if (data.stars.length !== 0) {
            setStarId(data.stars[0]._id)
          } else {
            setStarId('')
          }
        }
      },
    },
  )

  const [getStarCount] = useLazyQuery(STAR_COUNT_QUERY, {
    variables: {
      creationId: creation._id,
    },
    onCompleted: (data) => {
      if (data) {
        setStarCount(data.stars.length)
      }
    },
  })

  const [addStar] = useMutation<{ createStar: { _id: string } }, { createStarInput: CreateStarInput }>(
    ADD_STAR_MUTATION,
    {
      variables: {
        createStarInput: {
          username: profile.username,
          creationId: creation._id,
        },
      },
      onCompleted: (data) => {
        if (data) {
          setStarId(data.createStar._id)
          getStarCount()
        }
      },
    },
  )

  const [cancelStar] = useMutation(CANCEL_STAR_MUTATION, {
    variables: {
      removeStarId: starId,
    },
    onCompleted: (data) => {
      if (data) {
        setStarId('')
        getStarCount()
      }
    },
  })

  const handleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (!starId) {
      addStar()
    } else {
      cancelStar()
    }
    console.log('star!')
  }

  useEffect(() => {
    getStarCount()
    judgeStared()
  }, [creation])

  const styles = {
    meta: {
      button: `${!isCommon ? 'ml-3.5' : ''} px-2 space-x-1 rounded font-semibold bg-black/5 hover:bg-black/20`,
    },
  }

  return (
    <article
      className={`group relative p-3.5 -z-0 w-full h-fit
      hover:after:inset-0 hover:after:rounded-2xl
      after:absolute after:top-7 ${
        isCommon ? 'after:left-7 after:bottom-6' : 'after:left-3.5 after:bottom-0'
      } after:right-0 after:rounded-lg after:-z-10 after:bg-gray-200/60 after:transition-all after:duration-300`}
    >
      <Preview creation={creation} />
      <div className="">
        <div className="mt-3 flex items-center">
          {isCommon && (
            <Link href="/[username]" as={`/${creation.author}`}>
              <img src={data?.user.avatar} className="w-12 rounded-lg bg-white cursor-pointer" alt="" />
            </Link>
          )}
          <div className="flex flex-col flex-grow">
            <Link href="/[username]/creation/[id]" as={`/${creation.author}/creation/${creation._id}`}>
              <h2 className="flex-1 ml-3.5 mt-0.5 text-lg font-extrabold cursor-pointer hover:text-blue-600">
                {creation.title}
              </h2>
            </Link>
            {isCommon && (
              <Link href="/[username]" as={`/${creation.author}`}>
                <h3 className="ml-3.5 text-gray-500 cursor-pointer hover:text-gray-600">@{creation.author}</h3>
              </Link>
            )}
          </div>
          {/* ACTIONS */}
          <Popover className="inline-block relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`m-1 w-7 h-7 text-lg hover:text-black rounded-full active:bg-black/5 ${
                    open ? 'bg-white text-black' : 'text-black/30'
                  }`}
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
                  <Popover.Panel className="absolute bottom-9 right-0 px-2 py-3 mt-2 w-fit z-50 rounded-lg bg-white shadow-lg">
                    <Actions open={open} owner={creation.author} creationId={creation._id} />
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        <div
          className={`${
            isCommon
              ? 'relative left-7 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all delay-75 duration-500'
              : 'block'
          } mt-2 -mb-1 space-x-2`}
        >
          <button onClick={handleStar} className={styles.meta.button}>
            <FontAwesomeIcon icon={starId ? fasStar : farStar} className={`${starId ? 'text-yellow-400' : ''}`} />
            <span className="text-sm">{starCount}</span>
          </button>
          <button onClick={() => setIsModalActive(true)} className={styles.meta.button}>
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm">{creation.comments}</span>
          </button>
        </div>
        <PreviewModal isActive={isModalActive} onClose={() => setIsModalActive(false)} />
      </div>
    </article>
  )
}
