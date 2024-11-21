import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';

const ThongTinCaNhan = () => {
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                taikhoan: user.taikhoan,
                vaitro: user.vaitro,
                email: user.email,
                tndonvi: user.tendonvi,
                dienthoai: user.sdtdonvi,
                website: user.website,
                diachi: user.diachi
            });
        }
    }, [form, user]);


    const handleSubmit = async (values) => {
        try {
            const response = await axios.put(`http://192.168.38.131:3000/api/updateThongTin/${user.matk}`, {
                email: values.email,
                tendonvi: values.tndonvi,
                sdtdonvi: values.dienthoai,
                website: values.website,
                diachi: values.diachi
            });

            if (response.data.success) {
                message.success('Cập nhật thông tin thành công!');
                const updatedUser = { ...user, ...values };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            message.error('Cập nhật thông tin thất bại: ' + error.message);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
            <h4>Thông tin cá nhân</h4>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="taikhoan" label="Tài khoản">
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="vaitro" label="Vai trò">
                        <Input disabled />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="tndonvi" label="Tên đơn vị" >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="dienthoai" label="Điện thoại" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="website" label="Website" >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="diachi" label="Địa chỉ" >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ThongTinCaNhan;
