import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { ParsedUrlQuery } from 'querystring'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAstronaut, faCubes, faDisease, faGear, faLocationArrow, faLink } from '@fortawesome/free-solid-svg-icons'
import { faBuilding, faEnvelope } from '@fortawesome/free-regular-svg-icons'

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
    {
      label: 'settings',
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
          <div className="h-72 bg-sky-400 bg-[url('/img/bg-layout-light.svg')]"></div>
          <div className="px-20 xl:px-44 grid grid-cols-12 gap-x-8">
            <div className="-mt-32 lg:-mt-44 px-4 pb-20 col-span-4 2xl:col-span-3">
              <img src={profile.avatar} alt="" className="w-full rounded-full border-8 border-white" />
              <div className="my-8 max-w-fit">
                <h1 className="inline text-center">{profile.firstName + ' ' + profile.lastName}</h1>
                <p className="text-lg font-medium text-gray-400">@{profile.username}</p>
              </div>
              <div className="font-medium">
                <Link href={`/${profile.username}?tab=followers`}>
                  <a className="pr-4 hover:text-blue-600">100 followers</a>
                </Link>
                <span className="font-extrabold">·</span>
                <Link href={`/${profile.username}?tab=following`}>
                  <a className="pl-4 hover:text-blue-600">50 following</a>
                </Link>
              </div>
              <div className="flex flex-col my-6 space-y-2">
                <div className="space-x-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-gray-900" />
                  <span>Srcube</span>
                </div>
                <div className="space-x-2">
                  <FontAwesomeIcon icon={faLocationArrow} className="text-gray-900" />
                  <span>Shanghai, China</span>
                </div>
                <div className="space-x-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-900" />
                  <span>Tenn_Chio@icloud.com</span>
                </div>
                <div className="space-x-2">
                  <FontAwesomeIcon icon={faLink} className="text-gray-900" />
                  <span>https://chioio.tech</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col mb-14 col-span-8 2xl:col-span-9">
              <nav className="-mt-[3.4rem] rounded-t-lg bg-white border-b">
                {navigation.map((item, index) => (
                  <Link key={index} href={`/${username}${index === 0 ? '' : '?tab=' + item.label}`}>
                    <a
                      className={`inline-block py-2.5 px-6 space-x-2 text-xl font-semibold border-b-[6px] rounded-b-sm last:float-right ${
                        (!tab && index === 0) || tab === navigation[index].label
                          ? 'border-b-blue-600'
                          : 'border-b-transparent'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span
                        className={`inline-block first-letter:uppercase ${index === navigation.length - 1 && 'hidden'}`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="flex-1 rounded-b-md bg-white">
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
