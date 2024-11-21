import React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';

const Matkhau = () => {
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (values) => {
        try {
            
            const response = await axios.put(`http://192.168.38.131:3000/api/updateMatkhau/${user.matk}`, {
                oldPassword: values.oldmatkhau,
                newPassword: values.newmatkhau
            });

            if (response.data.success) {
                message.success('Thay đổi mật khẩu thành công!');
                form.resetFields();
            } else {
                message.error(response.data.message || 'Thay đổi mật khẩu thất bại!');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <h4>Mật khẩu</h4>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item 
                        name="oldmatkhau" 
                        label="Mật khẩu cũ" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu cũ!' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item 
                        name="newmatkhau" 
                        label="Mật khẩu mới" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item 
                        name="newmatkhau2" 
                        label="Xác nhận mật khẩu mới" 
                        dependencies={['newmatkhau']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newmatkhau') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Thay đổi mật khẩu
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Matkhau;
