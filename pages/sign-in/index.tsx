import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Header, Layout, Links, Main, Meta } from '@components/common'

const SignIn: NextPage = () => {
  const router = useRouter()
  const { username } = router.query
  return (
    <>
      <Head>
        <title>Srcube | Sign In</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <Main>SignIn</Main>
      </Layout>
    </>
  )
}

export default SignIn
