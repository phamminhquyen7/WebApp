const { quytrinhDB } = require("../../models/Quytrinh")
const { sanphamDB } = require("../../models/SanPham");

const createQuytrinh = async (req, res) => {
    try {
        const { tenqt, motaqt, chitietqt, matk } = req.body;

        const maxMaqt = await quytrinhDB.findOne().sort('-maqt');
        const newMaqt = maxMaqt ? maxMaqt.maqt + 1 : 1;

        const newQuytrinh = new quytrinhDB({
            maqt: newMaqt,
            tenqt,
            motaqt,
            chitietqt, 
            matk
        });

        await newQuytrinh.save();

        res.status(201).json({ success: true, message: "Quy trình đã được tạo thành công!", quytrinh: newQuytrinh });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi tạo quy trình.", error: error.message });
    }
};

const getQuytrinhs = async (req, res) => {
    try {
        const { matk } = req.query;
        const quytrinhs = await quytrinhDB.find({ matk });
        res.status(200).json({ success: true, data: quytrinhs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi lấy danh sách quy trình.", error: error.message });
    }
};

const deleteQuytrinh = async (req, res) => {
    try {
        const { maqt } = req.params;

        const isUsedInSanPham = await sanphamDB.findOne({ maqt });
        if (isUsedInSanPham) {
            return res.status(400).json({ success: false, message: "Không thể xóa quy trình đang được sủ dụng!" });
        }

        const deletedQuyTrinh = await quytrinhDB.findOneAndDelete({ maqt });

        if (!deletedQuyTrinh) {
            return res.status(404).json({ success: false, message: "Quy trình không tồn tại!" });
        }

        res.status(200).json({ success: true, message: "Quy trình đã được xóa thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa quy trình.", error: error.message });
    }
};

module.exports = {
    createQuytrinh,
    getQuytrinhs,
    deleteQuytrinh
}