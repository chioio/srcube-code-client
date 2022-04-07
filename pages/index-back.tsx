import type { NextPage } from 'next'
import Head from 'next/head'

import { Header, Layout, Meta, Links, Main, Footer } from '@components/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CreationItem } from '@components/platform'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Result } from '@lib/api/graphql'
import { GET_CREATIONS_QUERY } from '@lib/api/queries'
import { CreationEdge, CreationsOutput, Nullable } from '@lib/api/schema'
import { useWindowMounted } from '@lib/hooks'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const isWindowMounted = useWindowMounted()

  const [creations, setCreations] = useState<{
    pre?: Nullable<CreationEdge[]>
    cur?: Nullable<CreationEdge[]>
    next?: Nullable<CreationEdge[]>
  }>({
    pre: [],
    cur: [],
    next: [],
  })

  const [position, setPosition] = useState([-1, 0, 1])

  const {} = useQuery<Result<CreationsOutput>>(GET_CREATIONS_QUERY, {
    variables: {
      first: 8,
    },
    onCompleted: (data) => {
      if (data) {
        const [edges, count] = [data.creations.page.edges, data.creations.pageData?.count || 0]
        const [cur, next] = count > 6 ? [edges?.slice(0, 4), edges?.slice(4, 8)] : [edges, []]
        console.log(cur, next)
        setCreations({ ...creations, cur, next })
      }
    },
  })

  const [getCreations, { data }] = useLazyQuery<Result<CreationsOutput>>(GET_CREATIONS_QUERY, {})

  const handlePreviews = () => {
    setPosition([1, 0, -1])
    // setCreations({ pre: [], cur: creations.pre, next: creations.cur })
  }

  const handleNext = () => {
    setPosition([-1, 0, 1])
    // setCreations({ pre: creations.cur, cur: creations.next, next: [] })
  }
  useEffect(() => {
    if (isWindowMounted) {
    }
  }, [isWindowMounted])

  const styles = {
    control: {
      button:
        'group absolute h-full w-48 z-20 px-3 py-4 text-4xl text-white transition-all before:absolute before:top-0 before:w-[50vw] before:h-full before:bg-gray-100/40 before:backdrop-blur-sm hover:before:backdrop-blur-none',
      icon: 'relative px-4 py-6 bg-gray-300 rounded-lg group-active:bg-blue-600 group-active:ring-4 group-active:ring-blue-600/40',
    },
  }

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
          <div className="relative h-full w-full max-w-screen-xl mx-auto flex flex-col bg-gray-50">
            {/* <label className="relative block w-3/6 mx-auto my-8">
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
            </label> */}
            {/* CONTROL */}
            {/* {creations.pre?.length !== 0 && ( */}
              <button onClick={handlePreviews} className={`${styles.control.button} left-0 before:right-0`}>
                <FontAwesomeIcon icon={faAngleLeft} className={styles.control.icon} />
              </button>
            {/* )} */}
            <button onClick={handleNext} className={`${styles.control.button} right-0 before:left-0`}>
              <FontAwesomeIcon icon={faAngleRight} className={styles.control.icon} />
            </button>
            {/* TRENDING */}
            <div className="flex flex-col mx-auto my-6 w-full max-w-screen-xl rounded-2xl">
              <div className="w-full h-14 mb-4">
                <div className="flex items-center w-min px-4 h-full rounded-2xl bg-white dark:bg-gray-900">
                  <h1 className="text-4xl font-bold">Trending</h1>
                </div>
              </div>
              <div className="grid grid-rows-[minmax(0,100%)] grid-cols-[minmax(0,100%)] -translate-x-20 px-20 w-full h-fit transition-transform">
                <div className={`grid row-start-1 col-start-1 grid-rows-2 grid-cols-2 gap-4 p-4 -translate-x-full ${position[0] === -1 ? 'translate-x-full': ''}`}>
                  {creations.pre && creations.pre.map((item, index) => <CreationItem creation={item} key={index} />)}
                </div>
                <div className="grid row-start-1 col-start-1 grid-rows-[minmax(0,100%)] grid-cols-2 gap-x-4 gap-y-6 p-4 bg-white rounded-2xl dark:bg-gray-900">
                  {creations.cur && creations.cur.map((item, index) => <CreationItem creation={item} key={index} />)}
                </div>
                <div className="grid row-start-1 col-start-1 grid-rows-2 grid-cols-2 gap-4 p-4 translate-x-full">
                  {creations.next && creations.next.map((item, index) => <CreationItem creation={item} key={index} />)}
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

const Carousel: React.VFC<{ slide: Object }> = ({ slide }) => {
  return <div className=""></div>
}

const Slide: React.VFC<{ item: Object }> = ({ item }) => {
  return <div className=""></div>
}

export default Home
