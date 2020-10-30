const express = require('express');
const { graphqlHTTP: expressGraphQL } = require("express-graphql");
const schema = require('./schema/schema')

const app = express();
const port = process.env.PORT || 5000

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));


app.get('/', (req, res)=> res.send(`Hello, world!`))

app.listen(port, ()=> console.log(`App is listening on ${port}`))