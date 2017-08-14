import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools';
import { IncomingForm } from 'formidable';
import { rename } from 'fs';
import { typeDefs } from './typeDefs/typeDefs';
import { resolvers } from './resolvers/resolvers';


import { models } from './models/models'
import cors from 'cors';

const PORT = 7070;

const FILES_PATH = __dirname + '\\uploads\\';

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

app.post('/fileupload', (req, res) => {
  let form = new IncomingForm();
  form.type = true;
  form.maxFieldsSize = 2 * Math.pow(1024, 3);

  form.parse(req);

  form.on('fileBegin', function (name, file) {
    file.path = FILES_PATH + file.name;
  });

  form.on('file', function (name, file) {
    res.json({
      path: FILES_PATH + file.name
    });

  });

});

app.listen(PORT, '0.0.0.0', () => { console.log(`Server is running on http://localhost:${PORT}/graphiql`) });
