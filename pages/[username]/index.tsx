import Head from 'next/head'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGear,
  faUserAstronaut,
  faCubes,
  faDisease,
  faBuilding,
  faEnvelope,
  faLink,
  faLocationArrow,
  faMeteor,
  faBell,
} from '@fortawesome/free-solid-svg-icons'

import {
  Content,
  Footer,
  Header,
  Layout,
  Links,
  Meta,
} from '@components/common'
import { useAuth } from '@lib/context/AuthContext'
import { Banner } from '@components/platform'
import httpCsr from '@lib/utils/http-csr'
import shttp from '@lib/utils/http-ssr'
import { Creations } from '../../components/platform/_fragments/creations'
import { Follow } from 'typings'
import ProfileContext, {
  TUserProfile,
  useProfile,
} from '@lib/context/ProfileContext'
import {
  Followees,
  Followers,
  Overview,
  Settings,
  Stars,
  Notification,
} from '@components/platform/_fragments'
import { BASE_URL } from '@lib/utils'

export type TUrlQuery = {
  username: string
  page_num?: string
} & ParsedUrlQuery

export default function User(user: TUserProfile) {
  const { whoAmI } = useAuth()

  const router = useRouter()
  const { username, tab } = router.query

  return (
    <>
      <Head>
        <title>Srcube | Profile</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <Content decorated>
          <div className="h-80 bg-center banner">
            <Banner />
          </div>
          <div className="relative max-w-6xl md:px-8 mx-auto mb-16 w-full grid grid-cols-12 gap-x-8">
            <ProfileContext context={{ user }}>
              <Profile />
              <div className="flex flex-col col-span-8 2xl:col-span-9 w-full">
                <Navigation />
                <div className="flex-1 p-4 rounded-b-md bg-white">
                  {(!tab && <Overview />) ||
                    (tab === 'followers' && <Followers />) ||
                    (tab === 'following' && <Followees />) ||
                    (tab === 'creations' && <Creations />) ||
                    (tab === 'stars' && <Stars />) ||
                    (whoAmI?.username === username && tab === 'notice' && (
                      <Notification />
                    )) ||
                    (whoAmI?.username === username && tab === 'settings' && (
                      <Settings />
                    ))}
                </div>
              </div>
            </ProfileContext>
          </div>
        </Content>

        {/* FOOTER */}
        <Footer />
      </Layout>
    </>
  )
}

const Profile: React.FC<any> = ({}) => {
  const { whoAmI } = useAuth()

  const { user } = useProfile()

  const [follow, setFollow] = useState<Follow | null>(null)

  const handleToggleFollow = async () => {
    if (whoAmI) {
      const { data, status } = await httpCsr.put('/user/toggle-follow', {
        followee_id: user.id,
        follow_id: follow?.id || null,
      })
      // if in follows list, update creation list first
      if (status === 201) {
        setFollow(data)

        data
          ? toast.success('You are now following this user.')
          : toast.success('You are no longer following this user.')
      }
    } else {
      toast.error('You must be logged in to follow creations.')
    }
  }

  useEffect(() => {
    // fetch follow status
    const fetchFollow = async () => {
      if (user.id !== whoAmI?.id) {
        const { data, status } = await httpCsr.get('/user/follow', {
          params: {
            followee_id: user.id,
          },
        })

        if (status === 200) {
          setFollow(data)
        }
      }
    }

    whoAmI && fetchFollow()
  }, [whoAmI, user])

  return (
    <div className="-mt-32 lg:-mt-44 col-span-4 2xl:col-span-3">
      <img
        src={`${BASE_URL}/${user?.profile?.avatar}`}
        alt={user?.username}
        className="mx-auto w-[16rem] h-[16rem] rounded-full border-[10px] bg-white border-white"
      />
      <div className="mt-8 p-6 rounded-md bg-white">
        <div className="mt-2 mb-4">
          <h1 className="text-3xl inline text-center">
            {user?.first_name + ' ' + user?.last_name}
          </h1>
          <div className="space-x-4">
            <p className="inline-block text-lg font-medium text-gray-400">
              @{user.username}
            </p>
            {whoAmI && whoAmI.id !== user?.id ? (
              <button
                onClick={handleToggleFollow}
                className={`w-20 px-2 h-fit text-sm leading-4 text-white font-['Jost'] font-medium rounded-lg border-2 ${
                  follow
                    ? 'border-orange-500 bg-orange-500 active:ring-orange-500/40 '
                    : 'border-green-600 bg-green-600 active:ring-green-600/40 '
                } hover:bg-opacity-90 active:ring-2 transition-colors duration-300`}
              >
                {follow ? 'Unfollow' : 'Follow'}
              </button>
            ) : null}
          </div>
        </div>
        <div className="font-medium">
          <Link href={`/${user.username}?tab=followers`}>
            <a className="pr-4 hover:text-blue-600">
              {user?._count?.followers} followers
            </a>
          </Link>
          <span className="font-extrabold">·</span>
          <Link href={`/${user.username}?tab=following`}>
            <a className="pl-4 hover:text-blue-600">
              {user?._count?.followees} following
            </a>
          </Link>
        </div>
        <div className="flex flex-col my-6 space-y-3">
          <div className="space-x-2">
            <FontAwesomeIcon
              icon={faMeteor}
              className="font-medium text-gray-900"
            />
            <span>{user?.profile.bio}</span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon icon={faBuilding} className="text-gray-900" />
            <span>{user?.profile.org}</span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon icon={faLocationArrow} className="text-gray-900" />
            <span>{user?.profile.location}</span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-900" />
            <span>{user?.email}</span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon icon={faLink} className="text-gray-900" />
            <Link href={user.profile.website || '/'}>
              <a className="hover:text-blue-600">{user?.profile.website}</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const Navigation: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const router = useRouter()

  const { username, tab } = router.query

  const navigation = [
    {
      label: 'overview',
      icon: faUserAstronaut,
    },
    {
      label: 'creations',
      icon: faCubes,
    },
    {
      label: 'stars',
      icon: faDisease,
    },
  ]

  return (
    <nav className="-mt-[3.4rem] rounded-t-lg bg-white border-b">
      {navigation.map((item, index) => (
        <Link
          key={index}
          href={`/${username}${index === 0 ? '' : '?tab=' + item.label}`}
        >
          <a
            className={`inline-block py-2.5 px-6 space-x-2 text-xl font-semibold border-b-[6px] rounded-b-sm ${
              (!tab && index === 0) || tab === navigation[index].label
                ? 'border-b-blue-600'
                : 'border-b-transparent'
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span
              className={`inline-block font-['Jost'] first-letter:uppercase`}
            >
              {item.label}
            </span>
          </a>
        </Link>
      ))}
      {whoAmI?.username === username && (
        <div className="float-right text-lg mr-4">
          <Link href={`/${whoAmI!.username}?tab=notice`}>
            <a
              className={`group relative inline-block py-2.5 px-3 rounded-b-sm ${
                tab === 'notice' ? 'text-blue-600' : ''
              }`}
            >
              <FontAwesomeIcon
                icon={faBell}
                className="group-hover:animate-wiggle origin-top relative inline-flex"
              />
            </a>
          </Link>
          <Link href={`/${whoAmI!.username}?tab=settings`}>
            <a
              className={`group inline-block py-2.5 px-3 rounded-b-sm ${
                tab === 'settings' ? 'text-blue-600' : ''
              }`}
            >
              <FontAwesomeIcon
                icon={faGear}
                className="origin-center relative inline-flex group-hover:rotate-45 transition-transform duration-1000"
              />
            </a>
          </Link>
        </div>
      )}
    </nav>
  )
}

type TContext = {
  query: {
    username: string
  }
}

export async function getServerSideProps(ctx: TContext) {
  const profile = await shttp.get(`/user/profile`, {
    params: { user: ctx.query.username },
  })

  const readme = await shttp.get(`/user/readme`, {
    params: { user: ctx.query.username },
  })

  const user = { ...profile.data, readme: readme.data }

  return {
    props: user,
  }
}
