
import {GraphQLScalarType} from "graphql";

function serialize(value, fieldNodes) {

  //value = JSON.stringify(value);
  
  if (typeof value === 'string' && value !== '') {    
    let asjson = JSON.parse(value)
    return asjson;
  }

  return value;
}


function parseValue(value) {

  if (typeof value === 'string' && value !== '') {    
    let asjson = JSON.parse(value)
    return asjson;
  }

  let jsvalue = JSON.stringify(value);

  return jsvalue;
}


function parseLiteral(ast) {
  return JSON.stringify(ast);
}

  
export default class JsonScalarType extends GraphQLScalarType{
  constructor(name) {
    super({
      name: name,
      description: 'JSON Value',
      serialize:serialize,
      parseValue:parseValue,
      parseLiteral:parseLiteral});
  }
}
