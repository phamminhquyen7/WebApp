import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const ThemQuytrinh = ({ onSuccess, matk }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await axios.post('http://192.168.38.131:3000/api/createQuytrinh', {
                tenqt: values.tenqt,
                motaqt: values.motaqt,
                chitietqt: values.chitietqt,
                matk: matk
            });

            if (response.data.success) {
                message.success('Quy trình đã được tạo thành công!');
                form.resetFields();
                onSuccess(response.data.quytrinh);
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo quy trình: ' + error.message);
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
                        name="tenqt"
                        label="Tên quy trình"
                        rules={[{ required: true, message: 'Vui lòng nhập tên quy trình!' }]}
                    >
                        <Input placeholder="Nhập tên quy trình" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                name="motaqt"
                label="Mô tả quy trình"
            >
                <TextArea rows={4} placeholder="Nhập mô tả quy trình" />
            </Form.Item>

            <Form.Item
                name="chitietqt"
                label="Chi tiết quy trình"
                rules={[{ required: true, message: 'Vui lòng nhập chi tiết quy trình!' }]}
            >
                <TextArea rows={6} placeholder="Nhập chi tiết quy trình" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo quy trình
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ThemQuytrinh;
