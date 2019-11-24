var ncp = require('ncp').ncp;
 
ncp.limit = 1;

doCopy(".env", "build/.env")
//This is no longer required
//doCopy("../schema/types", "schema/types")

function doCopy(src, dest){

ncp(src, dest, err => {
    if (err) {
      return console.error(err);
    }
    console.log(`Copied ${src} to ${dest}`);
   });
}