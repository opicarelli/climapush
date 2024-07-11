import "module-alias/register";
import swaggerUi from "swagger-ui-express";
import app from "./app";
import { Router } from "express";
import definitions from "./docs/openapi-defination";

const port = normalizaPort(process.env.PORT || "3001");

const route = Router();

const options = {
    swaggerOptions: {
        url: "/api-docs/swagger.json",
    },
};
app.get("/api-docs/swagger.json", (req, res) => res.json(definitions));
app.use("/api-docs", swaggerUi.serveFiles(definitions, options), swaggerUi.setup(definitions, { explorer: true }));

app.use(route);

app.listen(port, () => {
    console.log(`LOCAL ENVIRONMENT: EXPRESS listening on port ${port}`);
});

/**
 * @param val port as text
 * @returns {number | boolean} port
 */
function normalizaPort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
