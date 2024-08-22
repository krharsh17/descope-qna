const express = require("express")
const postgres = require('postgres')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({ path: "../.env" })

const DescopeClient = require('@descope/node-sdk').default

const descopeClient = DescopeClient({ projectId: process.env.VITE_DESCOPE_PROJECT_ID });

const sql = postgres({
    host: process.env.PGHOST,            // Postgres ip address[s] or domain name[s]
    port: process.env.PGPORT,                   // Postgres server port[s]
    database: process.env.PGDATABASE,             // Name of database to connect to
    username: process.env.PGUSER,             // Username of database user
    password: process.env.PGPASSWORD,             // Password of database user
    ssl: {
        rejectUnauthorized: false // Adjust as needed for SSL settings
    }

})
// The rejectUnauthorized: false setting is used in this code to allow the PostgreSQL client to connect to the database even if the SSL certificate presented by the server cannot be verified. 

const app = express()

const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization || ""

        const sessionToken = authorizationHeader.split(" ")[1] || ""

        if (sessionToken === "") {
            res.status(400).json({ "message": "Unauthenticated user" })
            return
        }

        req.authInfo = await descopeClient.validateSession(sessionToken);

        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: "Unauthorized!" });
    }

}

app.use(cors())
app.use(authMiddleware)

app.get("/get-questions", async (req, res) => {
    const authInfo = req.authInfo;
    const isStudent = descopeClient.validateRoles(authInfo, ['Student']);
    const isTeacher = descopeClient.validateRoles(authInfo, ['Teacher']);


    let responseData = {};
    if (isTeacher || isStudent) {
        try {
            const questions = await sql`
               SELECT * FROM questions
           `;
            console.log('Fetched questions:', questions);

            responseData = {
                ...responseData,
                questions: questions.map(elem => elem.content)
            };

            if (isTeacher) {
                const answers = await sql`
                   SELECT * FROM answers
               `;
                console.log('Fetched answers:', answers);

                responseData = {
                    ...responseData,
                    answers: answers.map(elem => elem.content)
                };
            }
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    }

    res.status(200).json(responseData);
});

try {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
} catch (error) {
    console.error("Error starting the server:", error);
}