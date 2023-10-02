import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers.js';
import { TaskDB } from './db.js';
import { GraphQLError } from 'graphql';
import { parseAuthorizationHeader } from './auth.js';

const typeDefs = readFileSync('./schema.graphql', 'utf8');

const db = new TaskDB('./tasks.db');

const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers(db)
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req: { headers } }) => {
        const {username, password} = parseAuthorizationHeader(headers.authorization);
        const authenticated = await db.authenticate(username, password);

        if (!authenticated) {
            throw new GraphQLError('Authentication failed.');
        }

        return {};
    }
});

console.log(url);
