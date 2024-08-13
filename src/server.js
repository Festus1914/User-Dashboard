
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');

// Defining the schema and resolvers here
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

// Helper function to generate mock users with faker
const generateUsers = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: {
      name: faker.company.name(),
      address: faker.address.streetAddress(),
    },
  }));
};

const resolvers = {
  Query: {
    users: (parent, { page, limit, sort }) => {
      const allUsers = generateUsers(100);

      // Implement sorting logic here
      if (sort === 'name') {
        allUsers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'company') {
        allUsers.sort((a, b) => a.company.name.localeCompare(b.company.name));
      } else if (sort === 'email') {
        allUsers.sort((a, b) => a.email.localeCompare(b.email));
      }
      // Add other sorting options as needed

      // Implement pagination
      const startIndex = (page - 1) * limit;
      const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

      return paginatedUsers;
    },
  },
};

// Initialize Express app
const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply Apollo Server middleware to Express app
server.start().then(() => {
  server.applyMiddleware({ app });

  // Start the server
  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
});