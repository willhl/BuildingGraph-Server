import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import path from "path";

/**
 * Load graphql schemas form schema/types directory
 */
const schemaDir = path.join(__dirname, '../../schema/types');
// console.log(schemaDir)
const typesArray = fileLoader(schemaDir);
// console.log(typesArray);
export const typeDefs = mergeTypes(typesArray, { all: true }).toString("utf-8");
