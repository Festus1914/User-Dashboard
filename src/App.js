import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import UserList from './Components/UserList';
import Header from './Components/Header';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
      <Header></Header>
        <main className="p-4">
          <UserList/>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
