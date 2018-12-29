//con apollo
import { importSchema } from "graphql-import";

const typeDefs = importSchema('data/schema.graphql');

export {typeDefs};


//sin apolo
// import { resolvers } from "./resolvers";
// import { importSchema } from "graphql-import";
// import { makeExecutableSchema } from "graphql-tools";


// const typeDefs = importSchema('data/schema.graphql');
// const schema = makeExecutableSchema({typeDefs, resolvers});


// export {schema};