import Head from 'next/head'
import { useEffect } from 'react'

import { Meta, Links, Layout } from '@components/common'
import {
  CodingEditors,
  CodingHeader,
  LeftView,
  RightView,
  TopView,
} from '@components/platform'
import CodeEditorProvider from '@lib/context/CodeEditorContext'
import CodingProvider, { CodingConsumer, EViewDirection, useCoding } from '@lib/context/CodingContext'

export default function Create() {
  const { creation } = useCoding()

  return (
    <>
      <Head>
        <title>Srcube | {creation.title}</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        <CodingProvider>
          <CodeEditorProvider>
            {/* HEADER */}
            <CodingHeader />
            {/* CONTENT */}
            <main className="flex-grow flex flex-col border-t border-slate-200">
              <CodingConsumer>
                {({ direction }) => (
                  <>
                    {direction === EViewDirection.LEFT && (
                      <LeftView>
                        <CodingEditors />
                      </LeftView>
                    )}
                    {direction === EViewDirection.TOP && (
                      <TopView>
                        <CodingEditors />
                      </TopView>
                    )}
                    {direction === EViewDirection.RIGHT && (
                      <RightView>
                        <CodingEditors />
                      </RightView>
                    )}
                  </>
                )}
              </CodingConsumer>
            </main>
          </CodeEditorProvider>
        </CodingProvider>
      </Layout>
    </>
  )
}
