import Head from 'next/head'
import {
  Meta,
  Links,
  Layout,
  Header,
  Content,
  Footer,
} from '@components/common'
import { useAuth } from '@lib/context/AuthContext'
import { TrendingItem } from '@components/platform/TrendingItem'
import { Key, useState } from 'react'
import httpSsr from '@lib/utils/http-ssr'
import httpCsr from '@lib/utils/http-csr'
import { useRouter } from 'next/router'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

enum EOperate {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

export default function Search({
  page: { creations, ...info },
}: {
  page: { creations: any; info: any }
}) {
  const { whoAmI } = useAuth()

  const query = useRouter().query

  const [data, setData] = useState(creations)
  const [pageInfo, setPageInfo] = useState<any>(info)

  const handleOperate = async (operate: EOperate) => {
    const { data, status } = await httpCsr.get(
      `/search?q=${query.q}?page=${
        operate === EOperate.PREV
          ? query.page
            ? Number(query.page) + 1
            : 0 + 1
          : query.page
          ? Number(query.page) - 1
          : 0 - 1
      }`
    )

    if (status === 200) {
      const { creations, ...info } = data
      setData(creations)
      setPageInfo(info)
    }
  }

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
              Results
            </h1>

            <div
              className={`relative flex-grow w-full px-20 box-border transition-transform duration-700`}
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
              <div className={`max-w-4xl mx-auto grid grid-rows-1 grid-cols-1`}>
                <div className="bg--blue-400 trending-slide">
                  {data?.length
                    ? data.map((creation: any, j: number) => (
                        <TrendingItem key={j} creation={creation} />
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { data } = await httpSsr.get('/search?q=' + context.query.q)

  return {
    props: {
      page: data,
    },
  }
}
