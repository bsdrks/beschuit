# Bizcuit Code Challenge

I spent about 4 hours on the assignment:
- 1 hour researching stack
- 1.5 hours on server implementation
- 1.5 hours on client implementation

It's been a while since I last worked with this exact stack. I chose to work with simple and popular frameworks and libraries. I wanted at least the bare minimum front-end, back-end, and testing.

My personal goal with this assignment was to refamiliarize myself with the Node.js ecosystem. I have extensive experience in Node.js and front-end, but in the last two to three years I have worked mostly with Rust, on very domain-specific problems. In other words, I'm a bit rusty.

## Back-end
- SQLite via sqlite3 for the database. Not necessarily ideal for in a production environment, but fine for a quick prototype.
- Apollo Server for GraphQL API. Would be fine in production, but for a real project I would probably combine it with something like fastify or express for middleware and additional routing.
- GraphQL Codegen to generate TypeScript types from the GraphQL schema. I like this workflow, also for production.
- Argon2 with basic HTTP auth for authentication. Clearly not production-ready. When it comes to crypto and auth, I usually defer as much as possible to existing solutions.

## Front-end
- React for SPA and components, as requested.
- Apollo Client and Apollo React hooks to run GraphQL queries and mutations. Slots in nicely with Apollo Server.

## QA
- Playwright for end-to-end testing, to test the entire round-trip of creating and deleting tasks via the UI.
- ESLint for style and conventions.
- Prettier for uniform code style.

## If I Had More Time
If I had more time, I would (ordered by importance):
- need to know more about the user
- complete the implementation: editable tasks titles, task deadlines, grouping, offline functionality, etc.
- implement authentication and authorization (depending on user needs) with JWT's and rules. Auth should probably be its own service.
- manage state properly on the front-end: no polling shenanigans
- use express or fastify to organize the server
- test at least the entire happy path, and if given time, most of the unhappy path
- choose a more robust database like MySQL or PostgreSQL, depending on the need for speed, and because a full-fledged TODO application will require a wider variety of data types, especially for dates and numbers
- complete documentation
- set up baseline benchmarks for the API and for the round-trip e2e tests

## Requirements
- 

## Running

In `./server`, run:

```sh
npm install
npm run start
```

In `./client`, run:

```sh
npm install
npm run start
```

The application can now be accessed at: (http://localhost:3000)[http://localhost:3000].

## Testing

To run the end-to-end test, in `./client`, run:

```
npx playwright install
npx playwright test --ui
```