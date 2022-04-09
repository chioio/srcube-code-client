import { Fragment, useEffect, useState } from 'react'

import { Popover, Transition } from '@headlessui/react'
import {
  faEllipsis,
  faHandSparkles,
  faPenToSquare,
  faThumbtack,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DeleteModal } from './DeleteModal'
import { EditInfoModal } from './EditInfoModal'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '@lib/store/atoms'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Follow, Pin } from '@lib/api/schema'
import { useWindowMounted } from '@lib/hooks'
import toast from 'react-hot-toast'

interface ActionProps {
  owner: string
  creationId: string
}

type GetPinVariables = {
  username: string
}

type GetPinOutput = { pin: Pin }

const GET_PIN_QUERY = gql`
  query Pin($username: String!) {
    pin(username: $username) {
      creationIds
    }
  }
`

type UpdatePinVariables = {
  username: string
  creationId: string
  pined: boolean
}

type UpdatePinOutput = {
  updatePin: boolean
}

const UPDATE_PIN_MUTATION = gql`
  mutation UpdatePin($creationId: String!, $username: String!, $pined: Boolean!) {
    updatePin(creationId: $creationId, username: $username, pined: $pined)
  }
`

type GetFollowVariables = {
  username: string
  following: string
}

type GetFollowOutput = {
  follow: Follow
}

const GET_FOLLOW_QUERY = gql`
  query Follow($username: String!, $following: String!) {
    follow(username: $username, following: $following) {
      _id
      username
      following
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
  _id: string
}

type UnfollowOutput = boolean

const UNFOLLOW_MUTATION = gql`
  mutation RemoveFollow($_id: String!) {
    removeFollow(_id: $_id)
  }
`

export const Actions: React.VFC<{ open: boolean; owner: string; creationId: string }> = ({
  open,
  owner,
  creationId,
}) => {
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false)
  const [isEditModalActive, setIsEditModalActive] = useState(false)

  const [isFollowed, setIsFollowed] = useState('')
  const [isPined, setIsPined] = useState(false)

  const profile = useRecoilValue(userProfileState)

  const [getPin] = useLazyQuery<GetPinOutput, GetPinVariables>(GET_PIN_QUERY, {
    variables: {
      username: profile.username,
    },
    onCompleted: (data) => {
      if (data) {
        data.pin.creationIds.indexOf(creationId) === -1 ? setIsPined(false) : setIsPined(true)
      }
    },
  })

  const [getFollow] = useLazyQuery<GetFollowOutput, GetFollowVariables>(GET_FOLLOW_QUERY, {
    variables: {
      username: profile.username,
      following: owner,
    },
    onCompleted: (data) => {
      if (data) {
        data.follow?._id ? setIsFollowed(data.follow._id) : setIsFollowed('')
      }
    },
  })

  const [updatePin] = useMutation<UpdatePinOutput, UpdatePinVariables>(UPDATE_PIN_MUTATION, {
    variables: {
      username: profile.username,
      creationId,
      pined: isPined,
    },
    onCompleted: (data) => {
      if (data) {
        data.updatePin ? setIsPined(!isPined) : toast.error('Pins max length is 6!')
      }
    },
  })

  const [follow] = useMutation<FollowOutput, FollowVariables>(FOLLOW_MUTATION, {
    variables: {
      username: profile.username,
      following: owner,
    },
    onCompleted: (data) => {
      if (data) {
        data.createFollow._id && setIsFollowed(data.createFollow._id)
      }
    },
  })

  const [unFollow] = useMutation<UnfollowOutput, UnfollowVariables>(UNFOLLOW_MUTATION, {
    variables: {
      _id: isFollowed,
    },
    onCompleted: (data) => {
      if (data) {
        setIsFollowed('')
      }
    },
  })

  const handleEditInfo = () => {}

  const handlePin = () => {
    updatePin({
      variables: {
        username: profile.username,
        pined: !isPined,
        creationId,
      },
    })
  }

  const handleFollow = () => {
    isFollowed ? unFollow() : follow()
  }

  useEffect(() => {
    if (open) {
      getPin()
      getFollow()
    }
  }, [open])

  const styles = {
    action: {
      icon: 'w-6',
      button: 'px-2 py-1 rounded w-full space-x-2 text-left whitespace-nowrap hover:bg-blue-600/80 hover:text-white',
    },
  }

  return (
    <>
      <ul className="">
        <li className={`p-0.5 border-b`}>
          <button onClick={handlePin} className={styles.action.button}>
            <FontAwesomeIcon icon={faThumbtack} className={`${styles.action.icon} ${isPined ? 'rotate-45' : ''}`} />
            <span>{isPined ? 'Remove from Pins' : 'Add to Pins'}</span>
          </button>
        </li>
        {owner === profile.username ? (
          <>
            <li className={`p-0.5 border-b`}>
              <button onClick={() => setIsEditModalActive(true)} className={styles.action.button}>
                <FontAwesomeIcon icon={faPenToSquare} className={styles.action.icon} />
                <span>Edit info</span>
              </button>
            </li>
            <li className={`p-0.5`}>
              <button
                onClick={() => setIsDeleteModalActive(true)}
                className={`${styles.action.button} hover:!bg-red-500 hover:text-white`}
              >
                <FontAwesomeIcon icon={faTrashCan} className={styles.action.icon} />
                <span>Delete</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li className={`p-0.5`}>
              <button onClick={handleFollow} className={`${styles.action.button} hover:!bg-blue-600 hover:text-white`}>
                <FontAwesomeIcon icon={isFollowed ? faXmark : faHandSparkles} className={styles.action.icon} />
                <span>
                  <span className="text-sm">{isFollowed ? 'Unfollow' : 'Follow'}</span> @{owner}
                </span>
              </button>
            </li>
          </>
        )}
      </ul>
      <EditInfoModal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)} />
      <DeleteModal isActive={isDeleteModalActive} onClose={() => setIsDeleteModalActive(false)} />
    </>
  )
}
