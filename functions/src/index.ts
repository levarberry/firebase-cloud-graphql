const functions = require("firebase-functions");
const express = require('express');
const  admin = require('firebase-admin')
import { ApolloServer, gql} from 'apollo-server-express';
//import { collection } from "@firebase/firestore";
import { ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';

//const serviceAccount = require('./serviceAccount.json');
import serviceAccount from './serviceAccount.json'
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRE_DB_URL
})

//Type Defs Here
const typeDefs = gql`
 type Event {
     id: String,
     name: String,
     onDate: String,
     location: String
 }

 type Query{
    events: [Event]
 }

  
`

const resolvers = {
    Query: {
        events: () =>{
           return []

        }
    }
}
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
const server = new ApolloServer({typeDefs, resolvers, plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],})

startUp();
async function startUp(){
  await server.start()
  server.applyMiddleware({app, path:"/", cors: true});
}



export const graphql = functions.https.onRequest(app)