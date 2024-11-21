const { sanphamDB } = require("../../models/SanPham")
const { taikhoanDB } = require("../../models/Tai_khoan")
const { postdata } = require('../../blockchain/postdata');
const crypto = require('crypto'); 



const getQuytrinhkiemdinhs = async (req, res) => {
    try {
        const sanphams = await sanphamDB.find({ trangthaiqt: "Đang kiểm định" });
        
        res.status(200).json({ success: true, data: sanphams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi lấy danh sách quy trình.", error: error.message });
    }
};

const xacthuckiemdinh = async (req, res) => {
    try {           

        const { masp ,signature, matk} = req.body;

        let formattedKey = signature.replace(/(-----BEGIN PRIVATE KEY-----)(.*?)(-----END PRIVATE KEY-----)/, (match, p1, p2, p3) => {
        
            const formattedContent = p2.trim().replace(/ /g, '\n');
            return `${p1}\n${formattedContent}\n${p3}`;
        });


        const sanPham = await sanphamDB.findOne({ masp });
        const taikhoan = await taikhoanDB.findOne({ matk });

        
        if (!sanPham) {
            return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại!" });
        }
        
        const productData = "qưeqwe";

        const sign = crypto.createSign("SHA256");
        sign.update(productData);
        sign.end();
        const userSignature = sign.sign(formattedKey, "base64");

        const publicKey = taikhoan.publickey; 
        const verify = crypto.createVerify("SHA256");
        verify.update(productData);
        verify.end();

        const isValid = verify.verify(publicKey, userSignature, "base64");

        if (!isValid) {
            return res.status(401).json({ success: false, message: "Khóa riêng không chính xác hoặc không khớp!" });
        }

        const matkdef = "89987";
        const signaturedef = {
            credentials: {
                certificate: `-----BEGIN CERTIFICATE-----\nMIICgDCCAiagAwIBAgIUANLSx1LuuP7q4qbJd22K4fLaQQ0wCgYIKoZIzj0EAwIw\ncDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQH\nEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMjQxMTA4MDI0NTAwWhcNMjUxMTA4MDUyMzAw\nWjBCMTAwCwYDVQQLEwRvcmcxMA0GA1UECxMGY2xpZW50MBIGA1UECxMLZGVwYXJ0\nbWVudDExDjAMBgNVBAMTBTg5OTg3MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\n+j6BM4zRuCKi3jYcO2G6Bt6C01kg5DaA+nOMX9gsZxjX3V9ACVf5RUQvRwTB95aO\n+Jqfrvp8c2ReOCvGsyTho6OByzCByDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/\nBAIwADAdBgNVHQ4EFgQUOkrSvbRQLgYeEY1J2cJ1M8mhjmkwHwYDVR0jBBgwFoAU\n2jWoKgpgkVkT7c6qyXjm1AQP1Z8waAYIKgMEBQYHCAEEXHsiYXR0cnMiOnsiaGYu\nQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYuRW5yb2xsbWVudElE\nIjoiODk5ODciLCJoZi5UeXBlIjoiY2xpZW50In19MAoGCCqGSM49BAMCA0gAMEUC\nIQDelvFQCalvV+drNcljUXOP8Ujad0PTJ7PUglOZCn0jzwIgOSoj1UrigVx4X4AU\nBF6x/1UTSXzKSRE41/Qnb1ebYgk=\n-----END CERTIFICATE-----\n`,
                privateKey: `-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQggnXIU+P94eER2sgI\r\nYzrJ9LKqbGP/+qwPWH1psloBp1yhRANCAAT6PoEzjNG4IqLeNhw7YboG3oLTWSDk\r\nNoD6c4xf2CxnGNfdX0AJV/lFRC9HBMH3lo74mp+u+nxzZF44K8azJOGj\r\n-----END PRIVATE KEY-----\r\n`
            },
            mspId: "Org1MSP",
            type: "X.509"
        };

        postdata(matkdef, signaturedef, sanPham.masp, sanPham.tensp, sanPham.motasp, sanPham.maqt, sanPham.macoso);

        sanPham.trangthaiqt = "Đã kiểm định";
        await sanPham.save();


        res.status(200).json({
            success: true,
            message: "Xác thực thành công!",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xac thuc.", error: error.message });
    }
};


module.exports = { 
    getQuytrinhkiemdinhs,
    xacthuckiemdinh
}