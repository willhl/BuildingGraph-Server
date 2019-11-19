import { typeDefs } from "./graphql-schema";
import { ApolloServer } from "apollo-server-express";

import express from "express";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

import UnitFloatScalarType from "./units/UnitFloatScalarType"
import ScalarUnitResolvers from "./units/ScalarUnitResolvers"
var convert = require('convert-units')

// set environment variables from ../.env
dotenv.config();

const app = express();

/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Optionally a config object can be included to specify which types to include
 * in generated queries and/or mutations. Read more in the docs:
 * https://grandstack.io/docs/neo4j-graphql-js-api.html#makeaugmentedschemaoptions-graphqlschema
 */
//console.log(typeDefs)

const resolvers = {
  
  UnitFloat : new UnitFloatScalarType("UnitFloat"),
  Meters: new UnitFloatScalarType("Meters", "m"),
  SquareMeters : new UnitFloatScalarType("SquareMeters", "m2"),
  CubicMilliMeters : new UnitFloatScalarType("CubicMilliMeters", "mm2"),
  CubicMeters : new UnitFloatScalarType("CubicMeters", "m3"),
  Amperes : new UnitFloatScalarType("Amperes", "A"),
  Kiloamperes : new UnitFloatScalarType("Kiloamperes", "kA"),
  Milliamperes : new UnitFloatScalarType("Milliamperes", "mA"),
  Watts : new UnitFloatScalarType("Watts", "W"),
  VoltAmperes : new UnitFloatScalarType("VoltAmperes", "VA"),
  LitersPerSecond: new UnitFloatScalarType("LitersPerSecond", "l_per_s"),
}


const schema = makeAugmentedSchema({typeDefs, resolvers});

/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */
const server = new ApolloServer({
  context: { driver },
  schema: schema,
  introspection: true,
  playground: true
});

// Specify port and path for GraphQL endpoint
const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = "/graphql";

/*
* Optionally, apply Express middleware for authentication, etc
* This also also allows us to specify a path for the GraphQL endpoint
*/
server.applyMiddleware({app, path});

app.listen({port, path}, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});
