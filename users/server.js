const express = require('express');
const { graphqlHTTP: expressGraphQL } = require("express-graphql");
const app = express();
const port = process.env.PORT || 3000

app.use('/graphql', expressGraphQL({
  graphiql: true
}));


app.get('/', (req, res)=> res.send(`Hello, world!`))

app.listen(port, ()=> console.log(`App is listening on ${port}`))