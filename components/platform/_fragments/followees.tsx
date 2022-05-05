import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EGetFollowsType, Follow, Profile, User } from 'typings'
import httpCsr from '@lib/utils/http-csr'
import { useAuth } from '@lib/context/AuthContext'
import toast from 'react-hot-toast'
import { useProfile } from '@lib/context/ProfileContext'
import { Pagination } from '@components/platform'
import { BASE_URL } from '@lib/utils'
import Link from 'next/link'
import { TUrlQuery } from 'pages/[username]'

type TFollowee = Follow & {
  followee: User & {
    profile: Profile
  }
}

type TFollowees = {
  follows: TFollowee[]
  hasPrevPage: boolean
  hasNextPage: boolean
  pageNum: number
}

export const Followees: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const { dispatch } = useProfile()
  const router = useRouter()
  const { username, page_num = 1, tab } = router.query as TUrlQuery

  const [followees, setFollowees] = useState<TFollowees>({
    follows: [],
    hasPrevPage: false,
    hasNextPage: false,
    pageNum: 1,
  })

  const handleUnfollow = async (follow: TFollowee) => {
    if (whoAmI) {
      const { status } = await httpCsr.put('/user/toggle-follow', {
        follow_id: follow.id,
      })
      // if in follows list, update creation list first
      if (status === 201) {
        const updated = followees.follows.filter((f) => f.id !== follow.id)
        setFollowees({ ...followees, follows: updated })

        dispatch({
          type: 'UNFOLLOW',
          payload: {},
        })

        toast.success('You are no longer following this user.')
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
          type: EGetFollowsType.FOLLOWEES,
          page: page_num || 1,
        },
      })

      if (status === 200) {
        setFollowees(data)
      }
    }

    username && page_num && fetchFollows()
  }, [username, page_num])

  return (
    <div className="flex flex-col h-full">
      <ul role="list" className="flex-1 space-y-4">
        {followees.follows.map((follow, index) => (
          <li
            key={index}
            className="flex items-center w-full space-x-4 py-2 px-4 rounded-lg bg-gray-50"
          >
            <Link
              href={`/[username]`}
              as={`/${follow.followee.username}`}
              passHref
            >
              <img
                className="h-10 w-10 rounded-full cursor-pointer"
                src={`${BASE_URL}/${follow.followee.profile.avatar}`}
                alt=""
                width={50}
                height={50}
              />
            </Link>
            <div className="flex-1 ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-900">
                {follow.followee.first_name + ' ' + follow.followee.last_name}
              </p>
              <Link
                href={`/[username]`}
                as={`/${follow.followee.username}`}
                passHref
              >
                <p className="cursor-pointer inline-block text-sm text-slate-500 truncate hover:font-bold">
                  {'@' + follow.followee.username}
                </p>
              </Link>
            </div>
            {whoAmI && (
              <button
                onClick={() => handleUnfollow(follow)}
                className="float-right px-4 h-fit font-['Jost'] font-medium rounded-lg border-2 border-orange-500 bg-orange-500 bg-opacity-10 hover:bg-opacity-20 active:text-white active:bg-opacity-100 active:ring-2 active:shadow-md active:ring-orange-500/40"
              >
                Unfollow
              </button>
            )}
          </li>
        ))}
      </ul>
      {followees.follows.length ? (
        <Pagination
          pageInfo={{
            hasPrevPage: followees.hasPrevPage,
            hasNextPage: followees.hasNextPage,
          }}
          onPrevPage={() => handleChangePage('PREV')}
          onNextPage={() => handleChangePage('NEXT')}
        />
      ) : null}
    </div>
  )
}
