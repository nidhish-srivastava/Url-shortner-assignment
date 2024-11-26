const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: 'Url shortner API',
    description: 'API docs for my Url shortner API',
  },
  host : 'localhost:3000', 
};

const outputFile = './swagger-output.json';  
const routes = ['./routes.js'];

// Generate the Swagger documentation
swaggerAutogen()(outputFile, routes, doc);