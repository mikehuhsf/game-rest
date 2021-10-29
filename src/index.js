import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import data1 from "../games_dataset";
import data2 from "../platform_dataset";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import expressSwaggerGenerator from "express-swagger-generator";

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json()).use(cors());
app.get("/", (request, response) => response.send("Video game and Platforms UW restAPI"));
const host = `localhost:${PORT}`;
const basePath = "/"; // The forward slash is important!
// Options for the Swagger generator tool
const options = {
    // The root document object for the API specification
    // More info here: https://github.com/OAI/OpenAPISpecification/blob/master/versions/2.0.md#schema
    swaggerDefinition: {
        info: {
            title: "Video Game Info API",
            description: "This is Web service for platforms and video games.",
            version: "1.0.0",
        },
        host: host,
        basePath: basePath,
        produces: ["application/json"],
        schemes: ["http", "https"],
    },
    basedir: __dirname, // Absolute path to the app
    files: ["./routes/**/*.js"], // Relative path to the API routes folder to find the documentation
};
// Initialize express-swagger-generator and inject it into the express app
expressSwaggerGenerator(app)(options);

app.get("/api/v1/games", (req, res) => res.json(data1.games));
app.get("/api/v1/games/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const game = data1.games.find((doc) => doc.id === id);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    return res.json(game);
});


app.post("/api/v1/games", (req, res) => {
    const nextID = data1.games.length + 1;
    const game = { id: nextID, ...req.body };
    data1.games.push(game);
    res.status(201).json(game);
})

app.get("/api/v1/platforms", (req, res) => res.json(data2.platforms));
app.get("/api/v1/platforms/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const platform = data2.platforms.find((platform) => platform.id === id);
    if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
    }
    return res.json(platform);
});
app.post("/api/v1/platforms", (req, res) => {
    const nextID = data2.platforms.length + 1;
    const platform = { id: nextID, ...req.body };
    data2.platforms.push(platform);
    res.status(201).json(platform);
})
app.use("/api/v1/vgs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => console.log(`Hello world, I am listening on port ${PORT}!`));