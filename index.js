//refactoring to Apolo

import express from 'express';
import { ApolloServer}  from "apollo-server-express";
import { typeDefs } from './data/schema';
import { resolvers } from "./data/resolvers";
import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});
import jwt from 'jsonwebtoken';

const app = express();
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: async({req}) => {
    //aqui obtengo el token que mando desde Aplolo cliente en operation.setContext
    const token = req.headers['authorization']
    if(token !== "null"){
      try {
        const currentUser = await jwt.verify(token, process.env.SECRETO);
        req.currentUser = currentUser;
        return {
          currentUser
        }
      } catch (err) {
          console.error(err)
      }
    }
  }
});

server.applyMiddleware({app})

app.listen({port: 4000}, ()=> console.log(`El servidor esta funcionando http://localhost:4000${server.graphqlPath}`))








// sin apollo
// import express from 'express';
// import  graphqlHTTP  from "express-graphql";
// import {schema} from './data/schema';
// app.get('/', (req, res)=> {
//     res.send('Todo listo')
// })
// app.use('/graphql', graphqlHTTP({
//     // this is middleware
//     // que schema va utilizar
//     schema,
//     //uitilizar graphiql to see in the browser
//     graphiql: true
// }))
// app.listen(8000, ()=> console.log('El servidor esta funcionando'))
