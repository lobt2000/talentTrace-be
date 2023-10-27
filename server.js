const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

process.on('uncaughtException', () => {
    // from express error
    process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose
    .connect(DB)
    // eslint-disable-next-line no-console
    .then(() => console.log('DB connection successful'))
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('App running')
})

process.on('unhandledRejection', (err) => {
    // from mongoDb
    // eslint-disable-next-line no-console
    console.log(err.name, err.message)
    server.close(() => process.exit(1))
})
