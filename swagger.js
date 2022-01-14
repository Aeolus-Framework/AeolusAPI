const NODE_ENV = process.env.NODE_ENV;
const NODE_ENV_IS_DEV = NODE_ENV === "development";

if (NODE_ENV_IS_DEV) {
    require("dotenv").config();
}

const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");

const openapi_filename = "./dist/openapi_doc.json";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Aeolus API"
        },
        servers: [
            {
                url: NODE_ENV_IS_DEV ? "http://localhost:8080/" : "https://aeolus.se/api"
            }
        ],
        tags: [
            {
                name: "Simulator",
                description: "Simulator related stuff"
            },
            {
                name: "Alarms",
                description: "Subscribe and create alarms"
            },
            {
                name: "Social",
                description: "Interact with other users and other user related things"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./dist/routes/*.js"]
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFile(openapi_filename, JSON.stringify(openapiSpecification), "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log(`Openapi specification was sucesfully generated. Output location: "${openapi_filename}"`);
    }
});
