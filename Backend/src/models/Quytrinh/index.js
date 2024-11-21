const mongoose = require("mongoose");

const quytrinhSchema = new mongoose.Schema(
    {
        maqt: { type: Number, required: true, unique: true },  
        tenqt: { type: String, required: true, unique: true },
        motaqt: { type: String, required: true },
        chitietqt: { type: String, required: true },
        trangthaiqt: { type: String, required: false },
        matk: { type: String, required: true },
    }, 
    { timestamps: true }
);

const quytrinhDB = mongoose.model("quytrinh", quytrinhSchema);
module.exports = { quytrinhDB };
 