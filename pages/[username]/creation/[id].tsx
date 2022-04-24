import { Meta, Links, Layout } from '@components/common'
import {
  CodingHeader,
  LeftView,
  TopView,
  RightView,
  CodingEditors,
} from '@components/platform'
import CodeEditorProvider from '@lib/context/CodeEditorContext'
import CodingProvider, {
  CodingConsumer,
  EViewDirection,
} from '@lib/context/CodingContext'
import { TCreation } from '@lib/context/CreationsContext'
import httpSsr from '@lib/utils/http-ssr'
import Head from 'next/head'

export default function Edit({ creation }: { creation: TCreation }) {

  return (
    <>
      <Head>
        <title>Srcube | {creation.title}</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        <CodingProvider creation={creation}>
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
                        <CodingEditors
                          code={{
                            html: creation.code_html || '',
                            css: creation.code_css || '',
                            js: creation.code_js || '',
                          }}
                        />
                      </LeftView>
                    )}
                    {direction === EViewDirection.TOP && (
                      <TopView>
                        <CodingEditors
                          code={{
                            html: creation.code_html || '',
                            css: creation.code_css || '',
                            js: creation.code_js || '',
                          }}
                        />
                      </TopView>
                    )}
                    {direction === EViewDirection.RIGHT && (
                      <RightView>
                        <CodingEditors
                          code={{
                            html: creation.code_html || '',
                            css: creation.code_css || '',
                            js: creation.code_js || '',
                          }}
                        />
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

export async function getServerSideProps(context: { query: { id: string } }) {
  const { id } = context.query
  const { data } = await httpSsr.get('/creation', {
    params: {
      id,
    },
  })

  return {
    props: {
      creation: data,
    },
  }
}
