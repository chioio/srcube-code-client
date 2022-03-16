import { gql } from '@apollo/client'

export const EXISTED_CHECK_QUERY = gql`
  query EXISTED_CHECK($input: ExistedCheckInput!) {
    existedCheck(input: $input) {
      result
    }
  }
`
