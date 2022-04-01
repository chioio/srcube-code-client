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
      createdAt
      updatedAt
    }
  }
`
