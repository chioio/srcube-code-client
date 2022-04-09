import { gql } from '@apollo/client'

export const GET_USER_QUERY = gql`
  query User($username: String!) {
    user(username: $username) {
      email
      username
      firstName
      lastName
      avatar
      roles
      createdAt
      updatedAt
    }
  }
`

export const EXISTED_CHECK_QUERY = gql`
  query EXISTED_CHECK($input: ExistedCheckInput!) {
    existedCheck(input: $input) {
      result
    }
  }
`

export const GET_CREATION_QUERY = gql`
  query Creation($_id: String!) {
    creation(_id: $_id) {
      _id
      title
      author
      code {
        html
        css
        javascript
      }
      stars
      comments
      createdAt
      updatedAt
    }
  }
`

export const GET_USER_AVATAR_QUERY = gql`
  query User($username: String!) {
    user(username: $username) {
      avatar
    }
  }
`

export const GET_CREATIONS_QUERY = gql`
  query Creations($before: String, $after: String, $first: Float, $last: Float, $search: String) {
    creations(before: $before, after: $after, first: $first, last: $last, search: $search) {
      page {
        edges {
          cursor
          node {
            _id
            title
            author
            code {
              html
              css
              javascript
            }
            stars
            comments
            createdAt
            updatedAt
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
      }
      pageData {
        count
        limit
        offset
      }
    }
  }
`

