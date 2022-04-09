import { NextPage } from 'next'
import Head from 'next/head'
import { Header, Layout, Links, Main, Meta } from '@components/common'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Result } from '@lib/api/graphql'
import { CreationEdge, CreationPageInfo, CreationsOutput } from '@lib/api/schema'
import { GET_CREATIONS_QUERY } from '@lib/api/queries'
import { useWindowMounted } from '@lib/hooks'
import { CreationItem } from '@components/platform'
import { useRouter } from 'next/router'

const Search: NextPage = () => {
  const isWindowMounted = useWindowMounted()

  const { query } = useRouter()

  const [{ hasNextPage, hasPreviousPage, startCursor, endCursor }, setPageInfo] = useState<CreationPageInfo>({
    hasNextPage: false,
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
          search: query.q,
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
          search: query.q,
          last: null,
          before: null,
        },
      }).then(({ data }) => {
        if (data) {
          data.creations.page.edges && setCreations(data.creations.page.edges)
          data.creations.page.pageInfo &&
            setPageInfo({
              ...data.creations.page.pageInfo,
              // startCursor: data.creations.page.pageInfo?.startCursor || '',
              // endCursor: data.creations.page.pageInfo?.endCursor || '',
              // hasNextPage: data.creations.page.pageInfo?.hasNextPage || false,
              hasPreviousPage: true,
            })
        }
      })
    }
  }

  useEffect(() => {
    if (query.q) {
      getCreations({
        variables: {
          first: 4,
          search: query.q,
        },
      }).then(({ data }) => {
        console.log(data)
        if (data) {
          const [edges, count] = [data.creations.page.edges, data.creations.pageData?.count || 0]
          edges && setCreations(edges)
          data.creations.page.pageInfo &&
            setPageInfo({
              ...data.creations.page.pageInfo,
            })
          data.creations.pageData && data.creations.pageData.count > 4
            ? setPageInfo((value) => ({ ...value, hasNextPage: true }))
            : setPageInfo((value) => ({ ...value, hasNextPage: false }))
        }
      })
    }
  }, [query.q])

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
        <title>Srcube Code</title>
        <Meta />
        <Links />
      </Head>
      <Layout>
        {/* HEADER */}
        <Header />

        {/* MAIN PAGE */}
        <Main decorated>
          <div className="flex flex-col mx-auto my-6 w-full max-w-screen-xl rounded-2xl">
            <div className="flex items-center w-min px-4 h-full rounded-xl bg-white shadow-sm">
              <h1 className="py-2 text-3xl font-bold">Results</h1>
            </div>

            <div
              className={`grid grid-rows-[minmax(0,100%)] grid-cols-[minmax(0,100%)] -translate-x-20 px-20 w-full h-fit transition-transform
              `}
            >
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
              <Slide creations={creations} />
            </div>
          </div>
        </Main>
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

export default Search
