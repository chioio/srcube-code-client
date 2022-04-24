import Head from 'next/head'
import {
  Content,
  Footer,
  Header,
  Layout,
  Links,
  Meta,
} from '@components/common'

export default function _Error({ statusCode }: any) {
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
          <h1>{statusCode}</h1>
          <h2>Something went wrong...</h2>
        </Content>
        <Footer />
      </Layout>
    </>
  )
}

_Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

