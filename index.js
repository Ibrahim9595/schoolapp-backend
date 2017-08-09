import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { typeDefs } from './typeDefs/typeDefs';
import { resolvers } from './resolvers/resolvers';

import { models } from './models/models'
import cors from 'cors';

const PORT = 7070;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const app = express();
 
app.use(cors());

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: models }));

const logger = { log: (e) => console.error(e.stack) };
addErrorLoggingToSchema(schema, logger);

app.listen(PORT, '0.0.0.0', ()=>{console.log(`Server is running on http://localhost:${PORT}/graphiql`)});
