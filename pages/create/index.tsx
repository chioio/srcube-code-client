import { NextPage } from 'next'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'

import { creationState, viewDirectionState } from '@lib/store/atoms'
import { Layout, Links, Meta } from '@components/common'
import { HeaderPanel, LeftView, MainPanel, PreviewPanel, RightView, TopView } from '@components/coding'

const CreateCreation: NextPage = () => {
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

export default CreateCreation
