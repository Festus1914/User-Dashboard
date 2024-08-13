import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!, $sort: String!) {
    users(page: $page, limit: $limit, sort: $sort) {
      id
      name
      email
      phone
      company {
        name
        address
      }
    }
  }
`;
