const express = require('express')
const app = express()
const usersRouter = require("./src/routers/users/index");
const { DangKyAdmin } = require('./src/blockchain/enrollAdmin');
var cors = require("cors"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "*" }));

const connection = require('./src/config/database');
async function main() {
    try {
        DangKyAdmin()   
        await connection();
        app.use('/api', usersRouter);
        app.listen(3000, () => {
            console.log("Chương trình đang chạy");
        })
    } catch (error) { 
        console.log("ERR DB", error);
        console.log("Server ERR");
        process.exit();
    }
}
main();