
# Building Graph API Server

Much of the data used in the Architectural, Engineering and Construction (AEC) industry is siloed in propriety formats and scattered over many different locations. This API seeks to unify all the data requirements to a single API and a common language (the GraphQL Schema). Included in this repository is a schema for Mechanical, Electrical and Plumbing (MEP) building services.

The vision is for this API to form the fundamental source from which all AEC applications, and any associated services, can read and write the data they need, as mentioned in [this class at Autodesk University Las Vegas 2019](https://www.autodesk.com/autodesk-university/class/Unlock-Full-Potential-Your-MEP-Data-Case-Unified-Data-Model-2019).

It comprises of a Neo4j Graph database with a GraphQL layer provided by a Node.js server running Apollo with Neo4j specific libraries, aka, [GRANDstack](https://grandstack.io).

Additionally to this API and in separate repositories there are integrations and examples of using it with Autodesk Revit, Dynamo, and Rhino Grasshopper. 

 - Revit integration : [https://github.com/willhl/BuildingGraph-Client-Revit](https://github.com/willhl/BuildingGraph-Client-Revit)
 - Rhino integration : [https://github.com/willhl/BuildingGraph-Integration-RhinoGrasshopper](https://github.com/willhl/BuildingGraph-Integration-RhinoGrasshopper)
 - Example Dynamo and Grasshopper scripts : [https://github.com/willhl/BuildingGraph-Client-Examples](https://github.com/willhl/BuildingGraph-Client-Examples)


## Quickstart: Start a Building Graph server

With docker-compose installed it's just a few lines to get the full stack up and running:

```shell
git clone https://github.com/willhl/BuildingGraph-Server.git
cd BuildingGraph-Server
docker-compose up -d
```
This will build and create the Building Graph server and a Neo4j database with the schema, data and plugin directories mapped outside of the containers.

If started with the default setting the API will then be available at http://localhost:4002/graphql. Now fire up [GraphiQL](https://www.electronjs.org/apps/graphiql) or Postman and have a go with some GraphQL queries.

The .env file provided contains default values for the following essential configuration settings.

|ENV Name|Default|Usage| Context
|--|--|--|--|
| `GQL_NAME`  | example_bgs_1| Name of the Building Graph Server docker instance | Docker compose only
| `GQL_PORT`| 4002 | Port to use for  Building Graph Server GraphQL endpoint| All
|`NEO4j_NAME` |example_gdb_1| Name of the Neo4j docker instance|Docker compose only|
|`NEO4j_HTTP` |7474| HTTP port of the Neo4j instance|All|
|`NEO4j_HTTPS`|7473 |HTTPS port of the Neo4j instance|All|
|`NEO4j_BOLT`|7687 |BOLT port of the Neo4j instance|All|
|`NEO4J_USER`|neo4j|Username for Neo4j| All|
|`NEO4J_PASSWORD`|ne04j|Password for Neo4j|All|
|`GQL_JWT_SECRET` / `JWT_SECRET`|(empty)|(optional) The JSON Web Token authentication public key (see Authentication section) | Docker compose / otherwise |
|`GQL_AUTH_DIRECTIVES_ROLE_KEY` / `AUTH_DIRECTIVES_ROLE_KEY`|roles|(optional) The field in the JWT which defines the assigned user roles | Docker compose / otherwise |

### Local testing and development

First you'll need  a Neo4j instance, e.g. a [Neo4j Sandbox](http://neo4j.com/sandbox), a local instance via [Neo4j Desktop](https://neo4j.com/download), [Docker](http://hub.docker.com/_/neo4j) or a [Neo4j instance on AWS, Azure or GCP](http://neo4j.com/developer/guide-cloud-deployment) or [Neo4j Cloud](http://neo4j.com/cloud). Remember to set the env variables to the host, username and password of your chosen Neo4j instance.

You'll also need to have the [APOC library](https://github.com/neo4j-contrib/neo4j-apoc-procedures)  plugin installed in Neo4j, which is installed with docker-compose, and should be automatic in Sandbox, Cloud and is a single click install in Neo4j Desktop.

#### Local setup of Neo4j using Neo4j Desktop

1. [Download Neo4j Desktop](https://neo4j.com/download/)
2. Install and open Neo4j Desktop.
3. Create a new DB by clicking "New Graph", and clicking "create local graph".
4. Set password to "ne04j" (as suggested by `.env`), and click "Create".
5. Make sure that the default credentials in `.env` are used. Leave them as follows: `NEO4J_URI=bolt://localhost:7687 NEO4J_USER=neo4j NEO4J_PASSWORD=ne04j`
6. Click "Manage".
7. Click "Plugins".
8. Find "APOC" and click "Install".
9. Click the "play" button at the top of left the screen, which should start the server. _(screenshot 2)_
10. Wait until it says "RUNNING".
11. Proceed forward with the rest of the tutorial.

####  Local setup of the Building Graph API server
Ensure the required env variables are set then use these commands to start the server with debugging enabled:

```shell
git clone https://github.com/willhl/BuildingGraph-Server.git
cd BuildingGraph-Server/api
npm install
npm run-script start-dev
```
You can also use ```npm start ``` instead if you want to build and start the server without debugging.

If you make changes to the Building Graph code and want to update any docker containers you started with docker-compose, remember to run the docker-compose build step first: 
 
```shell
docker-compose build
docker-compose up
```

## API Authentication
Authentication can be implemented by including a JSON Web Token (JWT) in the request headers to the GraphQL API.  

There some additional steps needed to enable this:
1. Subscribe to an external authentication service which users can authenticate against to obtain a JSON Web Token (JWT)
2. Pass the JWT token in the Authorization header of each request
3. Set the GQL_JWT_SECRET (or JWT_SECRET if you're not using docker-compose)  env variable to the public key provided by your authentication service.
4. Add `@isAuthenticated` to each type or field in the GraphQL schema which requires authentication
5. Optionally, also add`@hasRole(roles:[<role name>])` to give access to users with specific roles provided in the JWT (see [the GRANDStack help docs](https://grandstack.io/docs/neo4j-graphql-js-middleware-authorization.html) for full details).
 


To avoid exposing the server directly to the internet use an upstream service (such as [Ngnix](https://www.nginx.com/), or [Azure API Management service with Azure AD](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad)) to authenticate the requests and pass them to the back-end service. This has many advantages, including adding SSL by default, and allowing you to direct requests to specific servers for load balancing or as part of multi-project set up. 

Since the Building Graph API is an Express server running in Node.js you can use any alternative authentication middleware of your choice, again see [the GRANDStack help docs](https://grandstack.io/docs/neo4j-graphql-js-middleware-authorization.html) for full details.
 

## Schema

The GraphQL schema is the principal part of the API, it consists of a collection of .graphql files located in the Schema/Types directory. This repository contains an example GraphQL scheme for an MEP orientated API, much of it is still work in progress, and you can make changes to suit your own requirements. 

The schema has Neo4j specific directives which the neo4j-graphql library (part of [GRANDstack](https://grandstack.io/docs/graphql-schema-generation-augmentation.html)) uses to automatically generate all the types, mutations and queries from the the GraphQL schema. This is the instrumental part as it removes the significant work required to build your own mutations and resolvers.

When the server starts all the .graphql files are augmented together into a single schema. In this way you can add to and augment the schema to maintain logical separation between the concerns of each use case by defining only the relevant types and fields in each .graphql file. If you wish, you can even host different parts of the schema on different servers.

For details on how to edit the schema, see the GRANDstack docs:
[https://grandstack.io/docs/graphql-schema-generation-augmentation.html](https://grandstack.io/docs/graphql-schema-generation-augmentation.html)

