import type { NextPage } from 'next'
import Head from 'next/head'

import { Header, Layout, Meta, Links, Main } from '@components/common'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        <Main>
          <h1 className="flex flex-1 py-4 border-t border-t-gray-100 justify-center items-center text-4xl font-bold">
            Welcome to &nbsp;
            <a href="https://nextjs.org" className="!text-blue-500">
              Next.js
            </a>
          </h1>
        </Main>
      </Layout>
    </>
  )
}

export default Home
