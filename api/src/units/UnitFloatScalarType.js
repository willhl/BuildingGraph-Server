
import {GraphQLScalarType, Kind, GraphQLError} from "graphql"
import convert from "convert-units"
import { stringify } from "querystring";

function serialize(value, fieldNodes, info) {
  
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    let num = value;
    if (typeof value === 'string' && value !== '') {
      num = Number(value);
    }
    if (!isFinite(num)) {
      throw new GraphQLError(
        `Float cannot represent non numeric value: ${value}`,
      );
    }

    let fromUnits = this.defaultUnits
    if (!fromUnits || fromUnits === "")
    {
       fromUnits = info.parentType._fields[fieldNodes[0].name.value].args[0].defaultValue
    }

    if (fromUnits && fieldNodes && fieldNodes[0] && fieldNodes[0].arguments && fieldNodes[0].arguments[0] && fieldNodes[0].arguments[0].value && fieldNodes[0].arguments[0].value.value)
    {
       let reqUnits = fieldNodes[0].arguments[0].value.value
       return convert(num).from(toConvertValue(fromUnits)).to(toConvertValue(reqUnits))
    }
    return num;
  }

function toConvertValue(graphQLUnit){
    return graphQLUnit.replace("_per_", "/").replace("_","-")
}

function parseValue(value) {
  
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    var num = value;
    if (typeof value === 'string' && value !== '') {
      num = Number(value);
    }

  if (!isFinite(num)) {
      throw new _graphql.GraphQLError("Float cannot represent non numeric value: " + value);
    }
    return num;
    //try to parse units out of string value?? but we might not have the default units
}


function parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
      throw new GraphQLError(
        'Float cannot represent non numeric value: ' + print(ast),
        ast,
      );
    }
    return parseFloat(ast.value);
  }

  
  export default class UnitFloatScalarType extends GraphQLScalarType{
    constructor(name, defaultUnits) {
      super({
        name: name,
        description: 'Float value with unit', 
        serialize:serialize, 
        parseValue:parseValue, 
        parseLiteral:parseLiteral});
      this.defaultUnits = defaultUnits;
    }
  }


