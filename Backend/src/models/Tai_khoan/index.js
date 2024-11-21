const mongoose = require("mongoose");

const taikhoanSchema = new mongoose.Schema(
    {
        matk: { type: Number, required: true, unique: true },  
        taikhoan: { type: String, required: true, unique: true },
        matkhau: { type: String, required: true },
        email: { type: String, required: true },
        vaitro: { type: String, required: true },
        tendonvi: { type: String, required: false },
        sdtdonvi: { type: Number, required: false },
        diachi: { type: String, required: false },
        website: { type: String, required: false },
        idkey: { type: String, required: false },
        tenchuky: { type: String, required: false },
        publickey: { type: String, required: false }
    }, 
    { timestamps: true } 
);

const taikhoanDB = mongoose.model("taikhoan", taikhoanSchema);
module.exports = { taikhoanDB };
