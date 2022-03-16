import { RecoilRoot } from 'recoil'
import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { config } from '@fortawesome/fontawesome-svg-core'
import { client } from '@lib/api/graphql'

import '../styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import type { AppProps } from 'next/app'

config.autoAddCss = false

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Toaster position="top-center" />
      <RecoilRoot>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </RecoilRoot>
    </>
  )
}

export default App
