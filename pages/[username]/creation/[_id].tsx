import { NextPage } from 'next'
import Head from 'next/head'
import { useRecoilState, useRecoilValue } from 'recoil'

import { HeaderPanel, LeftView, MainPanel, RightView, TopView } from '@components/coding'
import { Layout, Links, Meta } from '@components/common'
import { creationState, viewDirectionState } from '@lib/store/atoms'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GET_CREATION_QUERY } from '@lib/api/queries'
import { Creation } from '@lib/api/schema'
import { Result } from '@lib/api/graphql'
import { useEffect } from 'react'

const EditCreation: NextPage = ({}) => {
  const direction = useRecoilValue(viewDirectionState)
  const [creation, setCreation] = useRecoilState(creationState)

  const router = useRouter()
  const { query } = router

  const { data } = useQuery<Result<Creation>>(GET_CREATION_QUERY, {
    variables: {
      _id: query._id,
    },
    onCompleted: (data) => {
      data && setCreation(data.creation)
    },
  })

  return (
    <>
      <Head>
        <title>Srcube | {data?.creation.title}</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <HeaderPanel />
        {/* CONTENT */}
        <MainPanel>
          {creation._id ? (
            direction === 'top' ? (
              <TopView />
            ) : direction === 'left' ? (
              <LeftView />
            ) : (
              <RightView />
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <h1>Loading</h1>
            </div>
          )}
        </MainPanel>
      </Layout>
    </>
  )
}

export default EditCreation
