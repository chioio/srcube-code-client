import { NextPage } from 'next'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'

import { HeaderPanel, LeftView, MainPanel, RightView, TopView } from '@components/coding'
import { Layout, Links, Meta } from '@components/common'
import { creationState, viewDirectionState } from '@lib/store/atoms'

const EditCreation: NextPage = ({}) => {
  const direction = useRecoilValue(viewDirectionState)
  const creation = useRecoilValue(creationState)

  return (
    <>
      <Head>
        <title>Srcube | {creation.title}</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <HeaderPanel />
        {/* CONTENT */}
        <MainPanel>{direction === 'top' ? <TopView /> : direction === 'left' ? <LeftView /> : <RightView />}</MainPanel>
      </Layout>
    </>
  )
}

export default EditCreation
