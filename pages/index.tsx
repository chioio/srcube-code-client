import Head from 'next/head'
import { Content, Header, Layout, Links, Meta } from '@components/common'
import { useAuth } from '@lib/context/AuthContext'
import { Key, useEffect, useState } from 'react'
import httpSsr from '@lib/utils/http-ssr'
import { TrendingItem } from '@components/platform/TrendingItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import httpCsr from '@lib/utils/http-csr'
import { useRouter } from 'next/router'

enum EOperate {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

export default function Home({ page }: { page: any }) {
  const { whoAmI } = useAuth()

  const { creations, ...info } = page

  const [pages, setPages] = useState([
    [],
    creations.slice(0, 4),
    creations.slice(4, 8),
  ])
  const [pageInfo, setPageInfo] = useState(info)

  const handleOperate = async (operate: EOperate) => {
    const { data, status } = await httpCsr.get('/trending', {
      params: {
        cursor:
          operate === EOperate.PREV
            ? pages[0][0].id
            : pages[2][pages[2].length - 1].id,
        offset: operate === EOperate.PREV ? -4 : 4,
      },
    })

    if (status === 200) {
      const { creations, ...info } = data

      if (operate === EOperate.PREV) {
        pageInfo.hasPrevPage
          ? setPages([creations, ...pages.slice(0, 2)])
          : setPages([[], ...pages.slice(0, 2)])

        setPageInfo(info)
      } else {
        setPages([...pages.slice(1), creations])
        setPageInfo(info)
      }
    }
  }

  /*
  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await httpCsr('/trending')
      if (status === 200) {
        const { creations, ...info } = data
        setPages([[], creations.slice(0, 4), creations.slice(4, 8)])
        setPageInfo(info)
      }
    }

    fetchData()
  }, [whoAmI])
  */

  const styles = {
    pagination: {
      button:
        'group z-50 absolute top-0 h-full w-18 appearance-none border-none before:absolute before:top-0 before:w-[50vw] before:h-full focus:outline-none',
      div: 'flex items-center justify-center w-14 h-20 rounded-lg backdrop-blur bg-gray-400/50 shadow-lg group-hover:bg-blue-500 group-active:ring-4 group-active:ring-blue-600/50 group-focus:bg-blue-600',
      icon: 'text-white text-4xl',
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
        <Header />
        <Content decorated>
          <div className="flex-grow flex flex-col mx-auto w-full max-w-6xl">
            <h1 className="py-3 my-6 ml-4 px-6 w-fit text-4xl bg-white/80 rounded-2xl">
              Trending
            </h1>
            <div
              className={`relative flex-grow w-full px-20 box-border transition-transform duration-700 ${
                !pageInfo.hasPrevPage ? '-translate-x-20' : ''
              }`}
            >
              {pageInfo.hasPrevPage ? (
                <button
                  onClick={() => handleOperate(EOperate.PREV)}
                  data-operate="PREV"
                  className={`${styles.pagination.button} trending-pagination-btn left-0 before:left-0 before:-translate-x-[calc(50vw-5rem)]`}
                >
                  <div className={styles.pagination.div}>
                    <FontAwesomeIcon
                      icon={faCaretLeft}
                      className={styles.pagination.icon}
                    />
                  </div>
                </button>
              ) : null}
              {pageInfo.hasNextPage ? (
                <button
                  onClick={() => handleOperate(EOperate.NEXT)}
                  data-operate="NEXT"
                  className={`${styles.pagination.button} trending-pagination-btn right-0 before:right-0 before:translate-x-[calc(50vw-5rem)]`}
                >
                  <div className={styles.pagination.div}>
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      className={styles.pagination.icon}
                    />
                  </div>
                </button>
              ) : null}
              <div className={`w-full grid grid-rows-1 grid-cols-1`}>
                {pages.map((page, i) => (
                  <div
                    key={i}
                    data-position={i - 1}
                    className="bg--blue-400 trending-slide"
                  >
                    {page.length
                      ? page.map((creation: any, j: number) => (
                          <TrendingItem key={j} creation={creation} />
                        ))
                      : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await httpSsr.get('/trending')

  return {
    props: {
      page: data,
    },
  }
}
