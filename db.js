import postgres from 'pg'

const db = new postgres.Pool({
    user: "api",
    password: "Nomerok62630!",
    host: "localhost",
    port: 2345,
    database: "itbe"
})

export default db