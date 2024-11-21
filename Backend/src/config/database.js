const { default: mongoose } = require("mongoose");
const DB_STRING = "mongodb+srv://phamminhquyen6:TAO0biet@cluster0.8s40l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connection = async () => {
    try {
        const options = {
            dbName: "DBTest",
        };
        await mongoose.connect(DB_STRING, options)
    } catch (error) {
        console.log("ERR",error);
    }
};
module.exports = connection;