import express, { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import http from 'http';
import { json } from 'body-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { initSocket } from './socket';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

async function startServer() {
  // Create the Apollo Server instance with schema and resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // Configure CORS options
  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // Enable cookies and other credentials
  };

  // Create an Express application
  const app = express();
  app.use(json());

  app.use(
    '/graphql',
    cors(corsOptions),
    (req: Request, res: Response, next: NextFunction) => {
      const middleware = expressMiddleware(server, {
        context: async ({ req: innerReq }) => ({
          req: innerReq as unknown as Request<ParamsDictionary>,
        }),
      }) as unknown as (
        req: Request,
        res: Response,
        next: NextFunction
      ) => void;
      middleware(req, res, next);
    }
  );
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  initSocket(httpServer);
  // Create and start the HTTP server
  const port = process.env.PORT || 4000;
  httpServer.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}/graphql`)
  );
}

startServer();
