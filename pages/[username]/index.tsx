import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Header, Layout, Links, Main, Meta } from '@components/common'

const Profile: NextPage = () => {
  const router = useRouter()
  const { username } = router.query
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
        <Main>{username} Profile</Main>
      </Layout>
    </>
  )
}

export default Profile
