const { ApolloServer, gql } = require('apollo-server-lambda');
const { faker } = require('@faker-js/faker');
const cors = require('cors');

// Defining the schema and resolvers
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    company: Company
  }

  type Company {
    name: String
    address: String
  }

  type Query {
    users(page: Int!, limit: Int!, sort: String!): [User]
  }
`;

const resolvers = {
  Query: {
    users: (parent, { page, limit, sort }) => {
      const allUsers = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        company: {
          name: faker.company.name(),
          address: faker.address.streetAddress(),
        },
      }));

      if (sort === 'name') {
        allUsers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'company') {
        allUsers.sort((a, b) => a.company.name.localeCompare(b.company.name));
      } else if (sort === 'email') {
        allUsers.sort((a, b) => a.email.localeCompare(b.email));
      }

      const startIndex = (page - 1) * limit;
      return allUsers.slice(startIndex, startIndex + limit);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
