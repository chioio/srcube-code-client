import { Pagination } from '@components/platform'
import { useAuth } from '@lib/context/AuthContext'
import { useProfile } from '@lib/context/ProfileContext'
import { BASE_URL } from '@lib/utils'
import httpCsr from '@lib/utils/http-csr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { EGetFollowsType, Follow, Profile, User } from 'typings'
import { TUrlQuery } from '../../../pages/[username]'

type TFollower = Follow & {
  follower: User & { profile: Profile; followers: Follow[] }
}

type TFollowers = {
  follows: TFollower[]
  hasPrevPage: boolean
  hasNextPage: boolean
  pageNum: number
}

export const Followers: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const { dispatch } = useProfile()

  const router = useRouter()
  const { username, page_num = 1, tab } = router.query as TUrlQuery

  const [followers, setFollowers] = useState<TFollowers>({
    follows: [],
    hasPrevPage: false,
    hasNextPage: false,
    pageNum: 1,
  })

  const handleFollow = async (follow: TFollower) => {
    if (whoAmI) {
      const { data, status } = await httpCsr.put('/user/toggle-follow', {
        followee_id: follow.follower.id,
      })
      // if in follows list, update creation list first
      if (status === 201) {
        toast.success('You are now following this user.')
        const updated = followers.follows.map((f) => {
          if (f.follower.id === follow.follower.id) {
            f.follower.followers.push(data)
          }
          return f
        })

        setFollowers({ ...followers, follows: updated })

        dispatch({
          type: 'FOLLOW',
          payload: data,
        })
      }
    } else {
      toast.error('You must be logged in to follow creations.')
    }
  }

  const handleChangePage = (operate: 'NEXT' | 'PREV') => {
    if (operate === 'NEXT' && page_num) {
      router.push(`/${username}?tab=${tab}&page_num=${Number(page_num) + 1}`)
    } else {
      router.push(`/${username}?tab=${tab}&page_num=${Number(page_num) - 1}`)
    }
  }

  useEffect(() => {
    const fetchFollows = async () => {
      const { data, status } = await httpCsr.get('/user/follows', {
        params: {
          user: username,
          type: EGetFollowsType.FOLLOWERS,
          page: page_num || 1,
        },
      })

      if (status === 200) {
        setFollowers(data)
      }
    }

    if (whoAmI || (username && page_num)) fetchFollows()
  }, [username, page_num])

  return (
    <div className="flex flex-col h-full">
      <ul role="list" className="flex-1 space-y-4">
        {followers.follows.map((follow, index) => (
          <li
            key={index}
            className="flex items-center w-full space-x-4 py-2 px-4 rounded-lg bg-gray-50"
          >
            <Link
              href={`/[username]`}
              as={`/${follow.follower.username}`}
              passHref
            >
              <img
                className="h-10 w-10 rounded-full cursor-pointer"
                src={`${BASE_URL}/${follow.follower.profile.avatar}`}
                alt=""
                width={50}
                height={50}
              />
            </Link>
            <div className="flex-1 ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-900">
                {follow.follower.first_name + ' ' + follow.follower.last_name}
              </p>
              <Link
                href={`/[username]`}
                as={`/${follow.follower.username}`}
                passHref
              >
                <p className="cursor-pointer inline-block text-sm text-slate-500 truncate hover:font-bold">
                  {'@' + follow.follower.username}
                </p>
              </Link>
            </div>
            {whoAmI &&
              (whoAmI?.id !== follow.follower_id
                ? !follow.follower.followers.length && (
                    <button
                      onClick={() => handleFollow(follow)}
                      className="float-right px-4 h-fit font-['Jost'] font-medium rounded-lg border-2 border-green-600 bg-green-600 bg-opacity-10 hover:bg-opacity-20 active:text-white active:bg-opacity-100 active:ring-2 active:ring-green-600/40"
                    >
                      Follow
                    </button>
                  )
                : null)}
          </li>
        ))}
      </ul>
      {followers.follows.length ? (
        <Pagination
          pageInfo={{
            hasPrevPage: followers.hasPrevPage,
            hasNextPage: followers.hasNextPage,
          }}
          onPrevPage={() => handleChangePage('PREV')}
          onNextPage={() => handleChangePage('NEXT')}
        />
      ) : null}
    </div>
  )
}
