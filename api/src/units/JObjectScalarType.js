
import {GraphQLScalarType} from "graphql";

function serialize(value, fieldNodes) {

  if (typeof value === 'string') {    
    let asjson = JSON.parse(value)
    return asjson;
  }

  return value;
}


function parseValue(value) {

  let jsvalue = JSON.stringify(value);

  return jsvalue;
}


function parseLiteral(ast) {
  if (typeof ast === 'string') {    
    //let asjson = JSON.parse(value)
    return ast;
  }

  let jsvalue = JSON.stringify(ast.value);
  return jsvalue;
}

  
export default class JObjectScalarType extends GraphQLScalarType{
  constructor(name) {
    super({
      name: name,
      description: 'JSON Object',
      serialize:serialize,
      parseValue:parseValue,
      parseLiteral:parseLiteral});
  }
}
