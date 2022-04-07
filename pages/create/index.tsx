import { NextPage } from 'next'
import Head from 'next/head'
import { useRecoilState, useRecoilValue } from 'recoil'

import { creationState, viewDirectionState } from '@lib/store/atoms'
import { Layout, Links, Meta } from '@components/common'
import { HeaderPanel, LeftView, MainPanel, PreviewPanel, RightView, TopView } from '@components/coding'
import { useEffect } from 'react'
import { useWindowMounted } from '@lib/hooks'

const CreateCreation: NextPage = () => {
  const isWindowMounted = useWindowMounted()

  const direction = useRecoilValue(viewDirectionState)
  const [creation, setCreation] = useRecoilState(creationState)

  useEffect(() => {
    setCreation({
      _id: '',
      title: 'Untitled',
      author: (isWindowMounted && localStorage.getItem('user')) || '',
      code: {
        html: '',
        css: '',
        javascript: '',
      },
      createdAt: '',
      updatedAt: '',
    })
  }, [isWindowMounted])

  return (
    <>
      <Head>
        <title>Srcube | {creation?.title}</title>
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
