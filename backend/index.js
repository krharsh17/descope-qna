const express = require("express")
const postgres = require('postgres')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({path: "../.env"})

const DescopeClient = require('@descope/node-sdk').default

const descopeClient = DescopeClient({ projectId: process.env.VITE_DESCOPE_PROJECT_ID });

const sql = postgres({
    host: process.env.PGHOST,            // Postgres ip address[s] or domain name[s]
    port: process.env.PGPORT,                   // Postgres server port[s]
    database: process.env.PGDATABASE,             // Name of database to connect to
    username: process.env.PGUSER,             // Username of database user
    password: process.env.PGPASSWORD,             // Password of database user
})

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

    const isStudent = descopeClient.validateRoles(authInfo, ['Student'])
    const isTeacher = descopeClient.validateRoles(authInfo, ['Teacher']);


    let responseData = {}

    if (isTeacher || isStudent) {
        const questions = await sql`
            SELECT * FROM QUESTIONS
        `

        responseData = {
            ...responseData,
            questions: questions.map(elem => elem.content)
        }

        if (isTeacher) {
            const answers = await sql`
                SELECT * FROM ANSWERS
            `

            responseData = {
                ...responseData,
                answers: answers.map(elem => elem.content)
            }
        }
    }

    res.status(200).json(responseData)
})

app.listen(3000)