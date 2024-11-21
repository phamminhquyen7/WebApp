const { CoSoSanXuatDB } = require("../../models/CoSoSanXuat")
const { sanphamDB } = require("../../models/SanPham");


const createCoSoSanXuat = async (req, res) => {
    try {
        const { tencoso, diachi, sdt, email, matk } = req.body;

        const maxMaqt = await CoSoSanXuatDB.findOne().sort('-macoso');
        const newMaqt = maxMaqt ? maxMaqt.macoso + 1 : 1;

        const newCoSoSanXuat = new CoSoSanXuatDB({
            macoso: newMaqt,
            tencoso,
            diachi,
            sdt,
            email,
            matk
        });
  
        await newCoSoSanXuat.save();

        res.status(201).json({ success: true, message: "Cơ sở sản xuất đã được tạo thành công!", CoSoSanXuat: newCoSoSanXuat });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi tạo Cơ sở sản xuất.", error: error.message });
    }
};

const getCoSoSanXuat = async (req, res) => {
    try {
        const { matk } = req.query;
        const CoSoSanXuats = await CoSoSanXuatDB.find({ matk });
        res.status(200).json({ success: true, data: CoSoSanXuats });

    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi lấy danh sách Cơ sở.", error: error.message });
    }
};

const deleteCoSoSanXuat = async (req, res) => {
    try {
        const { macoso } = req.params;

        const isUsedInSanPham = await sanphamDB.findOne({ macoso });
        if (isUsedInSanPham) {
            return res.status(400).json({ success: false, message: "Không thể xóa Cơ sở đang được sử dụng!" });
        }

        const deletedCoSoSanXuat = await CoSoSanXuatDB.findOneAndDelete({ macoso });

        if (!deletedCoSoSanXuat) {
            return res.status(404).json({ success: false, message: "Cơ sở không tồn tại!" });
        }

        res.status(200).json({ success: true, message: "Cơ sở đã được xóa thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa Cơ sở.", error: error.message });
    }
};

module.exports = {
    createCoSoSanXuat,
    getCoSoSanXuat,
    deleteCoSoSanXuat
}