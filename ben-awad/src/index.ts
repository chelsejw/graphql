import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql'
import { PostResolver } from "./resolvers/post";
const app = express();

const port = process.env.PORT || 5000;
const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // Automatically run migrations
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }) // Available to all resolvers
  });

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