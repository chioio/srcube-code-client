import { gql } from '@apollo/client'

export const FIND_USER = gql`
  query User($username: String!) {
    user(username: $username) {
      email
      username
      nickname
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
