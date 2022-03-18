import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { ParsedUrlQuery } from 'querystring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAstronaut, faCubes, faDisease, faGear } from '@fortawesome/free-solid-svg-icons'

import { Footer, Header, Layout, Links, Main, Meta } from '@components/common'
import { userProfileState } from '@lib/store/atoms'
import { Overview } from './Overview'
import { Creations } from './Creations'
import { Follow } from './Follow'
import { Settings } from './Settings'
import { Stars } from './Stars'

interface UrlQuery extends ParsedUrlQuery {
  username: string
  tab: undefined | 'creations' | 'stars' | 'settings' | 'followers' | 'following'
}
const Profile: NextPage = () => {
  const router = useRouter()
  const profile = useRecoilValue(userProfileState)

  const { username, tab } = router.query as UrlQuery

  const navigation = [
    {
      label: 'Overview',
      icon: faUserAstronaut,
    },
    {
      label: 'Creations',
      icon: faCubes,
    },
    {
      label: 'Stars',
      icon: faDisease,
    },
    {
      label: 'Settings',
      icon: faGear,
    },
  ]

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
        <Main>
          <div className="h-72 bg-blue-600 bg-[url('/img/bg-layout-light.svg')]"></div>
          <div className="mx-auto px-20 xl:px-44 grid grid-cols-12 gap-x-12">
            <div className="-mt-24 pb-20 col-span-4">
              <img src={profile.avatar} alt="" className="mx-auto rounded-full border-[6px] border-white" />
              <div className=" my-4 mx-auto max-w-fit">
                <h1 className="inline text-center">{profile.firstName + ' ' + profile.lastName}</h1>
                <p className="text-lg font-medium text-gray-400">@{profile.username}</p>
              </div>
              <div className="text-center font-medium">
                <Link href={`/${profile.username}?tab=followers`}>
                  <a className="pr-4 hover:text-blue-600">100 followers</a>
                </Link>
                <span className="font-extrabold">·</span>
                <Link href={`/${profile.username}?tab=following`}>
                  <a className="pl-4 hover:text-blue-600">50 following</a>
                </Link>
              </div>
            </div>
            <div className="flex flex-col col-span-8">
              <nav className="-mt-12 rounded-t-lg bg-white">
                {navigation.map((item, index) => (
                  <Link key={index} href={`/${username}${index === 0 ? '' : '?tab=' + item.label.toLowerCase()}`}>
                    <a
                      className={`inline-block py-2.5 px-6 space-x-2 text-xl font-semibold border-b-[6px] rounded-b-sm ${
                        (!tab && index === 0) || tab === navigation[index].label.toLocaleLowerCase()
                          ? 'border-b-orange-500'
                          : 'border-b-transparent'
                      } ${index === navigation.length - 1 && 'float-right'}`}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span className={`${index === navigation.length - 1 ? 'hidden' : 'display-block'}`}>
                        {item.label}
                      </span>
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="flex-1 bg-white">
                {(!tab && <Overview />) ||
                  (tab === 'followers' && <Follow />) ||
                  (tab === 'following' && <Follow />) ||
                  (tab === 'creations' && <Creations />) ||
                  (tab === 'stars' && <Stars />) ||
                  (tab === 'settings' && <Settings />)}
              </div>
            </div>
          </div>
        </Main>

        {/* FOOTER */}
        <Footer />
      </Layout>
    </>
  )
}

export default Profile
