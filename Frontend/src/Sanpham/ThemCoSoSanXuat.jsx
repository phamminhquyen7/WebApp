import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const ThemCoSoSanXuat = ({ onSuccess, matk }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.38.131:3000/api/createCoSoSanXuat', {
                tencoso: values.tencoso,
                diachi: values.diachi,
                sdt: values.sdt,
                email: values.email,
                matk: matk
            });

            if (response.data.success) {
                message.success('Quy trình đã được tạo thành công!');
                form.resetFields();
                if (onSuccess) onSuccess(response.data.CoSoSanXuat);
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo cơ sở sản xuất: ' + error.message);
        } finally {
            setLoading(false);
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
                        name="tencoso"
                        label="Tên cơ sở"
                        rules={[{ required: true, message: 'Vui lòng nhập tên cơ sở!' }]}
                    >
                        <Input placeholder="Nhập tên cơ sở" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="diachi"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cơ sở!' }]}
            >
                <TextArea rows={2}  placeholder="Nhập địa chỉ cơ sở" />
            </Form.Item>

            <Form.Item
                name="sdt"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input  placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
            >
                <Input placeholder="Nhập Email" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo cơ sở sản xuất
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ThemCoSoSanXuat;
