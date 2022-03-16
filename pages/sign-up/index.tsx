import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Header, Layout, Links, Main, Meta } from '@components/common'

const SignUp: NextPage = () => {
  const router = useRouter()
  const { username } = router.query
  return (
    <>
      <Head>
        <title>Srcube | Sign Up</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <Main>Sign Up</Main>
      </Layout>
    </>
  )
}

export default SignUp
