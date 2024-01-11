const express = require("express")
const postgres = require('postgres')
const cors = require('cors')

const DescopeClient = require('@descope/node-sdk').default

const descopeClient = DescopeClient({ projectId: 'P2akLIXEBJz0AtAEbPVEzQ2YTSXV' });

const sql = postgres({
  host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
  port                 : 5432,                   // Postgres server port[s]
  database             : 'postgres',             // Name of database to connect to
  username             : 'postgres',             // Username of database user
  password             : 'password',             // Password of database user
})

const app = express()

app.use(cors())

app.get("/get-questions", async (req, res) => {

    const authorizationHeader = req.headers.authorization || ""

    const sessionToken = authorizationHeader.split(" ")[1] || ""

    if (sessionToken === "") {
        res.status(400).json({"message": "Unauthenticated user"})
        return
    }

    const authInfo = await descopeClient.validateSession(sessionToken);


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