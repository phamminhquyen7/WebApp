import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Register.css';

const { Option } = Select;

function Register({ onClose }) {
    const [formData, setFormData] = useState({
        taikhoan: '',
        matkhau: '',
        nhaplaimatkhau: '',
        email: '',
        vaitro: 'Người dùng',
        tendonvi: '',
        sdtdonvi: '',
        diachi: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    useEffect(() => {
        setShowAdditionalFields(['Doanh nghiệp', 'Kiểm Định'].includes(formData.vaitro));
    }, [formData.vaitro]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value) => {
        setFormData({ ...formData, vaitro: value });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.38.131:3000/api/register', {
                taikhoan: values.taikhoan,
                matkhau: values.matkhau,
                email: values.email,
                vaitro: values.vaitro,
                tendonvi: values.tendonvi || '',
                sdtdonvi: values.sdtdonvi || '',
                diachi: values.diachi || '',
                website: values.website || ''
            });
            
            if (response.data.success) {
                message.success(response.data.message);
                onClose();
            } else {
                message.error(response.data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                message.error(error.response.data.message || 'Đã xảy ra lỗi khi đăng ký');
            } else if (error.request) {
                message.error('Không thể kết nối đến server');
            } else {
                message.error('Đã xảy ra lỗi khi đăng ký');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-overlay">
            <div className="register-container">
                <Button 
                    className="close-button" 
                    icon={<CloseOutlined />} 
                    onClick={onClose}
                />
                <Form className="register-form" onFinish={handleSubmit}>
                    <h2>Đăng ký</h2>
                    <Form.Item
                        name="taikhoan"
                        rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                    >
                        <Input placeholder="Tài khoản" />
                    </Form.Item>
                    <Form.Item
                        name="matkhau"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name="nhaplaimatkhau"
                        dependencies={['matkhau']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('matkhau') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input type="email" placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="vaitro"
                        initialValue="Người dùng"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            onChange={(value) => setFormData(prev => ({ ...prev, vaitro: value }))}
                        >
                            <Option value="Người dùng">Người dùng</Option>
                            <Option value="Doanh nghiệp">Doanh nghiệp</Option>
                            <Option value="Kiểm Định">Kiểm Định</Option>
                        </Select>
                    </Form.Item>
                    {showAdditionalFields && (
                        <>
                            <Form.Item
                                name="tendonvi"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị!' }]}
                            >
                                <Input placeholder="Tên đơn vị" />
                            </Form.Item>
                            <Form.Item
                                name="sdtdonvi"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại đơn vị!' },
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Vui lòng chỉ nhập số!'
                                    },
                                ]}
                            >
                                <Input placeholder="Số điện thoại đơn vị" />
                            </Form.Item>
                            <Form.Item
                                name="diachi"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Địa chỉ" />
                            </Form.Item>
                            <Form.Item name="website">
                                <Input placeholder="Website" />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;