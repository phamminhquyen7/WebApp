const { taikhoanDB } = require("../../models/Tai_khoan")
const { Toakhoanguoidung } = require('../../blockchain/Toakhoanguoidung');

const VALID_ROLES = ['Admin', 'Người dùng', 'Doanh nghiệp',  ];

const register = async (req, res) => {
    const { taikhoan, matkhau, email, vaitro, tendonvi, sdtdonvi, diachi, website } = req.body; 

    if (!VALID_ROLES.includes(vaitro)) {
        return res.status(400).json({ success: false, message: "Vai trò không hợp lệ!" });
    }

    const existingUser = await taikhoanDB.findOne({ taikhoan });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại!" });
    }

    const existingEmail = await taikhoanDB.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email đã được sử dụng!" });
    }

    const latestUser = await taikhoanDB.findOne().sort({ matk: -1 });  
    const newMatk = latestUser ? latestUser.matk + 1 : 1;  

    const newUser = {
        matk: newMatk,   
        taikhoan,
        matkhau,
        email,
        vaitro
    };

    if (vaitro !== 'Người dùng') {
        if (!tendonvi || !sdtdonvi || !diachi ) {
            return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
        }
        newUser.tendonvi = tendonvi;
        newUser.sdtdonvi = sdtdonvi;
        newUser.diachi = diachi;
        newUser.website = website;
    }

    try {
        await taikhoanDB.create(newUser);
        return res.status(201).json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi đăng ký.", error: error.message });
    }
};


const login = async (req, res) => {
    const { taikhoan, matkhau } = req.body;

    const user = await taikhoanDB.findOne({ taikhoan });
    if (!user) {
        return res.status(400).json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    const isMatch = matkhau === user.matkhau;
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Mật khẩu không đúng!" });
    }

    return res.status(200).json({ 
        success: true,
        message: "Đăng nhập thành công!",
        user: {
            matk: user.matk,
            taikhoan: user.taikhoan,
            email: user.email,
            vaitro: user.vaitro,
            tendonvi: user.tendonvi,
            sdtdonvi: user.sdtdonvi,
            diachi: user.diachi,
            website: user.website,
            tenchuky: user.tenchuky,
            publickey: user.publickey
        }
    });
};

const updateThongTin = async (req, res) => {
    const { matk } = req.params;  
    const { email, tendonvi, sdtdonvi, website, diachi } = req.body;  

    try {
        const user = await taikhoanDB.findOne({ matk: parseInt(matk) });
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        user.email = email || user.email;
        user.tendonvi = tendonvi || user.tendonvi;
        user.sdtdonvi = sdtdonvi || user.sdtdonvi;
        user.website = website || user.website;
        user.diachi = diachi || user.diachi;

        await user.save();

        return res.status(200).json({ success: true, message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật thông tin.", error: error.message });
    }
};

const updateMatkhau = async (req, res) => {
    const { matk } = req.params;  
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await taikhoanDB.findOne({ matk: parseInt(matk) });
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        const isMatch = oldPassword === user.matkhau;
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng!" });
        }

        user.matkhau = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Thay đổi mật khẩu thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thay đổi mật khẩu.", error: error.message });
    }
};

const checkpasswd = async (req, res) => {
    const { matk } = req.params;  
    const { password } = req.body;   

    try {
        const user = await taikhoanDB.findOne({ matk: parseInt(matk) });
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        const isMatch = password === user.matkhau;
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Mật khẩu không chính xác!" });
        }

        return res.status(200).json({ success: true, message: "Mật khẩu chính xác!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi xác thực mật khẩu.", error: error.message });
    }
};

const taoKey = async (req, res) => {
    const { matk } = req.params;

    if (!matk) {
        return res.status(400).json({ success: false, message: "Thiếu matk!" });
    }

    try {
        const user = await taikhoanDB.findOne({ matk: parseInt(matk) });
        const x509Identity = await Toakhoanguoidung(matk);

        user.publickey = x509Identity.credentials.certificate || user.publickey;
        user.idkey = x509Identity.id || user.idkey;
        await user.save();


        return res.status(200).json({
            success: true, 
            message: "Đã khi tạo khóa.",  
            keys: {
                id: x509Identity.id,
                certificate: x509Identity.credentials.certificate,
                privateKey: x509Identity.credentials.privateKey
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi tạo khóa.", 
            error: error.message
        });
    }
};  

const luukey = async (req, res) => {
    const { matk } = req.params;  
    const { tenchuky } = req.body;  

    try {
        const user = await taikhoanDB.findOne({ matk: parseInt(matk) });
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        user.tenchuky = tenchuky || user.tenchuky;

        await user.save();

        return res.status(200).json({ success: true, message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật thông tin.", error: error.message });
    }
};


module.exports = {
    register,
    login,
    updateThongTin,
    updateMatkhau,
    checkpasswd,
    taoKey,
    luukey
}