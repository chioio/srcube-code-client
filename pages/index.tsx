import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

import { Header, Layout, Meta, Links, Main, Footer } from '@components/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CreationItem } from '@components/platform'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Result } from '@lib/api/graphql'
import { GET_CREATIONS_QUERY } from '@lib/api/queries'
import { CreationEdge, CreationPageInfo, CreationsOutput } from '@lib/api/schema'
import { useWindowMounted } from '@lib/hooks'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const isWindowMounted = useWindowMounted()

  const router = useRouter()

  const carouselRef = useRef<HTMLDivElement>(null)

  const [{ hasNextPage, hasPreviousPage, startCursor, endCursor }, setPageInfo] = useState<CreationPageInfo>({
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: '',
  })

  const [creations, setCreations] = useState<CreationEdge[]>()

  const [getCreations, { data }] = useLazyQuery<Result<CreationsOutput>>(GET_CREATIONS_QUERY, {
    variables: {
      first: 4,
    },
  })

  const handlePrevious = () => {
    console.log('PREV')

    if (data) {
      getCreations({
        variables: {
          after: null,
          first: null,
          last: 4,
          before: data.creations.page.pageInfo?.startCursor,
        },
      }).then(({ data }) => {
        if (data) {
          data.creations.page.edges && setCreations(data.creations.page.edges)
          setPageInfo({
            startCursor: data.creations.page.pageInfo?.startCursor || '',
            endCursor: data.creations.page.pageInfo?.endCursor || '',
            hasNextPage: true,
            hasPreviousPage: data.creations.page.pageInfo?.hasPreviousPage || false,
          })
        }
      })
    }
  }

  const handleNext = () => {
    console.log('NEXT')

    if (data) {
      getCreations({
        variables: {
          after: data.creations.page.pageInfo?.endCursor,
          first: 4,
          last: null,
          before: null,
        },
      }).then(({ data }) => {
        if (data) {
          data.creations.page.edges && setCreations(data.creations.page.edges)
          setPageInfo({
            startCursor: data.creations.page.pageInfo?.startCursor || '',
            endCursor: data.creations.page.pageInfo?.endCursor || '',
            hasNextPage: data.creations.page.pageInfo?.hasNextPage || false,
            hasPreviousPage: true,
          })
        }
      })
    }
  }

  useEffect(() => {
    isWindowMounted &&
      getCreations({
        variables: {
          first: 4,
        },
      }).then(({ data }) => {
        if (data) {
          const [edges, count] = [data.creations.page.edges, data.creations.pageData?.count || 0]
          edges && setCreations(edges)
          data.creations.page.pageInfo &&
            setPageInfo({
              ...data.creations.page.pageInfo,
              hasNextPage: true,
            })
        }
      })
  }, [isWindowMounted])

  useEffect(() => {
    console.log(creations)
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
          <div className="relative h-full w-full max-w-screen-xl mx-auto flex flex-col">
            {/* CONTROL */}
            {hasPreviousPage && (
              <button onClick={handlePrevious} className={`${styles.control.button} -left-20 before:right-0`}>
                <FontAwesomeIcon icon={faAngleLeft} className={styles.control.icon} />
              </button>
            )}
            {hasNextPage && (
              <button onClick={handleNext} className={`${styles.control.button} -right-20 before:left-0`}>
                <FontAwesomeIcon icon={faAngleRight} className={styles.control.icon} />
              </button>
            )}
            {/* TRENDING */}
            <div className="flex flex-col mx-auto my-6 w-full max-w-screen-2xl rounded-2xl">
              <div className="w-full h-14 mb-4">
                <div className="flex items-center w-min px-4 h-full rounded-2xl bg-white">
                  <h1 className="text-4xl font-bold">Trending</h1>
                </div>
              </div>

              <div
                ref={carouselRef}
                className={`grid grid-rows-[minmax(0,100%)] grid-cols-[minmax(0,100%)] -translate-x-20 px-20 w-full h-fit transition-transform ${
                  hasPreviousPage ? 'translate-x-0.5' : ''
                }`}
              >
                <Slide creations={creations} />
              </div>
            </div>
          </div>
        </Main>
        <Footer />
      </Layout>
    </>
  )
}

const Slide: React.VFC<{ creations: CreationEdge[] | undefined }> = ({ creations }) => {
  return (
    <div data-position={0} className={`grid row-start-1 col-start-1 grid-rows-2 grid-cols-2 gap-4 p-4 slide`}>
      {creations && creations.map((item, index) => item.node && <CreationItem creation={item.node} key={index} />)}
    </div>
  )
}

export default Home
