import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Row, Col } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const ThemSanPham = ({ onSuccess, matk }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [quyTrinhs, setQuyTrinhs] = useState([]);
    const [coSoSanXuats, setCoSoSanXuats] = useState([]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.38.131:3000/api/createSanPham', {
                tensp: values.tensp,
                motasp: values.motasp,
                maqt: values.maqt,
                macoso: values.macoso,
                matk: matk
            });


            if (response) {
                message.success('Sản phẩm đã được tạo thành công!');
                form.resetFields();
                onSuccess(response.data.SanPham);
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo sản phẩm: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoSoSanXuat();
        fetchQuyTrinh();
    }, []);

    const fetchCoSoSanXuat = async () => {
        try {
            const response = await axios.get(`http://192.168.38.131:3000/api/CoSoSanXuats?matk=${matk}`);
            if (response.data.success) {
                setCoSoSanXuats(response.data.data);
            } else {
                console.error('Failed to fetch CoSoSanXuats:', response.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu CoSoSanXuats:', error);
        }
    };

    const fetchQuyTrinh = async () => {
        try {
            const response = await axios.get(`http://192.168.38.131:3000/api/quytrinhs?matk=${matk}`);
            if (response.data.success) {
                setQuyTrinhs(response.data.data);
            } else {
                console.error('Failed to fetch quytrinh:', response.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu quy trình:', error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="tensp"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="motasp"
                label="Mô tả sản phẩm"
            >
                <TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Form.Item
                name="maqt"
                label="Quy trình"
                rules={[{ required: true, message: 'Vui lòng chọn quy trình!' }]}
            >
                <Select placeholder="Chọn quy trình">
                    {quyTrinhs.map((qt) => (
                        <Option key={qt.maqt} value={qt.maqt}>
                            {qt.tenqt}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="macoso"
                label="Cơ sở sản xuất"
                rules={[{ required: true, message: 'Vui lòng chọn cơ sở sản xuất!' }]}
            >
                <Select placeholder="Chọn cơ sở sản xuất">
                    {coSoSanXuats.map((cs) => (
                        <Option key={cs.macoso} value={cs.macoso}>
                            {cs.tencoso}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm sản phẩm
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ThemSanPham;
