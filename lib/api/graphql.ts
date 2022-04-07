import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const ENDPOINT = 'http://localhost:4000/graphql'

export const client = new ApolloClient({
  ssrMode: true,
  uri: ENDPOINT,
  cache: new InMemoryCache({ addTypename: false}),
})

export interface Variables<T> {
  input: T
}

export interface Result<T> {
  [key: string]: T
}
