import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Header, Layout, Links, Main, Meta } from '@components/common'

const Coding: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Srcube | Coding</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <Main>Coding</Main>
      </Layout>
    </>
  )
}

export default Coding
