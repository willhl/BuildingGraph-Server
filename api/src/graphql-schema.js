import { neo4jgraphql } from "neo4j-graphql-js";
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import fs from "fs";
import path from "path";

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

//var tdesf1 = fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")).toString("utf-8");


const typesArray = fileLoader(path.join(__dirname, './typesEnabled'));
console.log(typesArray);
//const typeDefs = mergeTypes(typesArray, { all: true });
//console.log(mergedTypes)
export const typeDefs = mergeTypes(typesArray, { all: true }).toString("utf-8");
