const mongoose = require("mongoose");

const CoSoSanXuatSchema = new mongoose.Schema(
    {
        macoso: { type: Number, required: true, unique: true },  
        tencoso: { type: String, required: true},
        diachi: { type: String, required: true },
        sdt: { type: Number, required: true },
        email: { type: String, required: true },
        matk: { type: String, required: true },
    }, 
    { timestamps: true }
);

const CoSoSanXuatDB = mongoose.model("CoSoSanXuat", CoSoSanXuatSchema);
module.exports = { CoSoSanXuatDB };
