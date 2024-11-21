const express = require('express');
const { register, login, updateThongTin, updateMatkhau, checkpasswd, taoKey, luukey } = require('../../controller/tai_khoan');
const { createQuytrinh, getQuytrinhs, deleteQuytrinh } = require('../../controller/quy_trinh');
const { createCoSoSanXuat, getCoSoSanXuat, deleteCoSoSanXuat } = require('../../controller/CoSoSanXuat');
const { createSanPham, getSanPham, deleteSanPham, signSanPham, readAlldata, truysuatsanpham  } = require('../../controller/SanPham');
const { getQuytrinhkiemdinhs, xacthuckiemdinh } = require('../../controller/kiem_dinh');



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put('/updateThongTin/:matk', updateThongTin);
router.put('/updateMatkhau/:matk', updateMatkhau);
router.post('/checkpasswd/:matk', checkpasswd);
router.post('/taokey/:matk', taoKey);
router.put('/luukey/:matk', luukey);

router.post("/createSanPham", createSanPham);

router.post("/createQuytrinh", createQuytrinh);
router.get("/quytrinhs", getQuytrinhs);
router.delete("/quytrinhs/:maqt", deleteQuytrinh);

router.post("/createCoSoSanXuat", createCoSoSanXuat);
router.get("/CoSoSanXuats", getCoSoSanXuat);
router.delete("/CoSoSanXuats/:macoso", deleteCoSoSanXuat);

router.post("/createSanPham", createSanPham);
router.get("/SanPhams", getSanPham);
router.delete("/SanPhams/:masp", deleteSanPham);
router.post("/signSanPham", signSanPham);
router.get('/readalldata', readAlldata);
router.get("/truysuatsanpham", truysuatsanpham);


router.get("/quytrinhkiemdinhs", getQuytrinhkiemdinhs);
router.post('/xacthuckiemdinh', xacthuckiemdinh);



module.exports = router;