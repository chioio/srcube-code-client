import type { NextPage } from 'next'
import Head from 'next/head'

import { Header, Layout, Meta, Links, Main, Footer } from '@components/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { CreationItem } from '@components/platform'

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
          <div className="h-full flex flex-col bg-gray-50 overflow-x-hidden">
            <label className="relative block w-3/6 mx-auto my-8">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-3 flex items-center pl-2">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-gray-300" />
              </span>
              <input
                className="placeholder:italic placeholder:text-slate-400 block text-2xl font-bold bg-white w-full border border-slate-300 rounded-xl py-4 pl-16 pr-3 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-blue-600/60 focus:ring-4"
                placeholder="Search for creation..."
                type="text"
                name="search"
              />
            </label>
            {/* TRENDING */}
            <div className="flex flex-col mx-auto my-6 w-full max-w-screen-xl rounded-2xl">
              <div className="w-full h-14 mb-4">
                <div className="flex items-center w-min px-4 h-full rounded-2xl bg-white dark:bg-gray-900">
                  <h1 className="text-4xl font-bold">Trending</h1>
                </div>
              </div>
              <div className="grid grid-rows-[minmax(0,100%)] grid-cols-[minmax(0,100%)] -translate-x-20 px-20 w-full h-fit">
                <div className="grid row-start-1 col-start-1 grid-rows-2 grid-cols-3 gap-4 p-4 -translate-x-full opacity-20">
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                </div>
                <div className="grid row-start-1 col-start-1 grid-rows-[minmax(0,100%)] grid-cols-3 gap-x-4 gap-y-6 p-4 bg-white rounded-2xl dark:bg-gray-900">
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                </div>
                <div className="grid row-start-1 col-start-1 grid-rows-2 grid-cols-3 gap-4 p-4 translate-x-full opacity-20">
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                  <CreationItem />
                </div>
              </div>
            </div>
          </div>
        </Main>
        <Footer />
      </Layout>
    </>
  )
}

export default Home
