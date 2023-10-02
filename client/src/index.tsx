import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    headers: {
        // This is bad :) I would normally use a JWT.
        authorization: `Basic ${btoa('admin:admin')}`
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ApolloProvider>
);
