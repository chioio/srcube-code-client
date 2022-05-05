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

  return (
    <>
      <Head>
        <title>Srcube | Untitled</title>
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
                        <CodingEditors code={{ html: '', css: '', js: ''}} />
                      </LeftView>
                    )}
                    {direction === EViewDirection.TOP && (
                      <TopView>
                        <CodingEditors code={{ html: '', css: '', js: ''}} />
                      </TopView>
                    )}
                    {direction === EViewDirection.RIGHT && (
                      <RightView>
                        <CodingEditors code={{ html: '', css: '', js: ''}} />
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
