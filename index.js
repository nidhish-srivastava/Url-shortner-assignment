const express = require('express');
const routes = require('./routes.js');
const dotenv = require("dotenv")
const cors = require("cors")
const {rateLimiter} = require("./utils/rateLimiter.js")
const {connectmongodb} = require("./utils/connectToDb.js")
const swaggerui = require("swagger-ui-express")
const swaggerDocument = require("./utils/swagger-output.json") 

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument))

app.use(cors({
    credentials: true
}))
app.use(rateLimiter)


const start = async () => {
    await connectmongodb()
    app.listen(port, () => {
        console.log(`Server is listening at port ${port}`);
    })
}
start()

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is running."
    });
});
app.use(routes);
