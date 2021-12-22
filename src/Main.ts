import { ApolloServer, ExpressContext, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

import * as schemasArr from "./schemas";

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

class Server {
    private readonly _APP: express.Express = express();
    private readonly _SERVER: http.Server = http.createServer(this._APP);
    private readonly _APOLLO_SERVER: ApolloServer<ExpressContext>;

    constructor() {
        this._APP = express();
        this._SERVER = http.createServer(this._APP);
        this._APOLLO_SERVER = new ApolloServer({
            typeDefs: gql(schemasArr.default.toString()),
            resolvers: {
                Query: {
                    books: () => books,
                },
            },
            plugins: [
                ApolloServerPluginDrainHttpServer({
                    httpServer: this._SERVER
                })
            ],
        });
    }

    public async startServer(): Promise<void> {
        await this._APOLLO_SERVER.start();
        this._APOLLO_SERVER.applyMiddleware({
            app: this._APP
        });
        this._SERVER.listen(4000);
        console.log(`🚀 Server ready at http://localhost:4000${this._APOLLO_SERVER.graphqlPath}`);
    }
}

// curl --request POST \
//   --header 'content-type: application/json' \
//   --url http://localhost:4000/graphql \
//   --data '{"query":"query { __typename }"}'

new Server().startServer();
