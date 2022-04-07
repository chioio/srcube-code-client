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
import React, { useEffect, useRef, useState } from 'react'

const Home: NextPage = () => {
  const isWindowMounted = useWindowMounted()

  const carouselRef = useRef<HTMLDivElement>(null)

  const [creations, setCreations] = useState<{
    pre?: Nullable<CreationEdge[]>
    cur?: Nullable<CreationEdge[]>
    nex?: Nullable<CreationEdge[]>
  }>({
    pre: [],
    cur: [],
    nex: [],
  })

  const {} = useQuery<Result<CreationsOutput>>(GET_CREATIONS_QUERY, {
    variables: {
      first: 8,
    },
    onCompleted: (data) => {
      if (data) {
        const [edges, count] = [data.creations.page.edges, data.creations.pageData?.count || 0]
        const [cur, nex] = count > 4 ? [edges?.slice(0, 4), edges?.slice(4, 8)] : [edges, []]
        setCreations({ ...creations, cur, nex })
      }
    },
  })

  const [getCreations, { data }] = useLazyQuery<Result<CreationsOutput>>(GET_CREATIONS_QUERY, {})

  const handlePreviews = () => {
    setCreations({ ...creations, pre: [] })

    if (carouselRef.current) {
      const node = carouselRef.current.children[2]
      carouselRef.current.removeChild(carouselRef.current.children[2])
      carouselRef.current.prepend(node)
      carouselRef.current.children[0].setAttribute('data-position', '-1')
      carouselRef.current.children[1].setAttribute('data-position', '0')
      carouselRef.current.children[2].setAttribute('data-position', '1')
    }
  }

  const handleNext = () => {
    setCreations({ ...creations, pre: creations.cur })

    if (carouselRef.current) {
      const node = carouselRef.current.children[0]
      carouselRef.current.removeChild(carouselRef.current.children[0])
      carouselRef.current.append(node)
      carouselRef.current.children[0].setAttribute('data-position', '-1')
      carouselRef.current.children[1].setAttribute('data-position', '0')
      carouselRef.current.children[2].setAttribute('data-position', '1')
    }
  }

  useEffect(() => {
    if (isWindowMounted) {
      console.log(carouselRef.current)
    }
  }, [isWindowMounted])

  useEffect(() => {
    console.log(creations.pre)
  }, [creations])

  const styles = {
    control: {
      button:
        'group absolute h-full w-48 z-20 px-3 py-4 text-4xl text-white transition-all before:relative before:top-0 before:w-[50vw] before:h-full before:bg-gray-100/40 before:backdrop-blur-sm hover:before:backdrop-blur-none',
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

        <Main decorated>
          <div className="relative h-full w-full max-w-screen-xl mx-auto flex flex-col bg-gray-50">
            {/* CONTROL */}
            {creations.pre?.length !== 0 && (
              <button onClick={handlePreviews} className={`${styles.control.button} left-0 before:right-0`}>
                <FontAwesomeIcon icon={faAngleLeft} className={styles.control.icon} />
              </button>
            )}
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
              <div
                ref={carouselRef}
                className={`grid grid-rows-[minmax(0,100%)] grid-cols-[minmax(0,100%)] -translate-x-20 px-20 w-full h-fit transition-transform ${
                  creations.pre?.length ? 'translate-x-2' : ''
                }`}
              >
                {creations &&
                  Object.entries(creations).map(([_, value], index) => {
                    return <Slide key={index} pos={index - 1} creations={value} />
                  })}
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

const Slide: React.VFC<{ creations: Nullable<CreationEdge[]>; pos: number }> = ({ creations, pos }) => {
  return (
    <div data-position={pos} className="grid row-start-1 col-start-1 grid-rows-2 grid-cols-2 gap-4 p-4 slide">
      {creations ? creations.map((item, index) => <CreationItem creation={item} key={index} />) : <h1>Hello</h1>}
    </div>
  )
}

export default Home
