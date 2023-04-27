// Open a Apollo Server with graphql schema

import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { context } from "./context";

//1
import { schema } from "./schema";
export const server = new ApolloServer({
  schema,
  context,
});

const port = 3000;

server.listen({ port }).then(() => {
  console.log(`Server ready at 3000`);
});
