import Head from 'next/head'
import { Content, Header, Layout, Links, Meta } from '@components/common'
import { useAuth } from '@lib/context/AuthContext'

export default function Home() {
  const { whoAmI } = useAuth()

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
          <h1>{whoAmI ? 'Authorized...' + whoAmI.id : 'Unauthorized...'}</h1>
        </Content>
      </Layout>
    </>
  )
}
