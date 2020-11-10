import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql'
import { HelloResolver } from "./resolvers/hello";
const app = express();

const port = process.env.PORT || 5000;
const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // Automatically run migrations
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    })
  })

  apolloServer.applyMiddleware({app});


  const posts = await orm.em.find(Post, {}); 


  
  app.get(`/`, (_,res) => {
    res.send(posts)
  })

  app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
  })

};

main()
.catch(err => {
  console.log(err)
});