import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Login.css'; // Tạo file CSS mới cho Login

function Login({ onLogin, onClose, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        taikhoan: '',
        matkhau: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.taikhoan || !formData.matkhau) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://192.168.38.131:3000/api/login', formData);
            if (response.data.success) {
                message.success(response.data.message);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('matk', response.data.user.matk); 
                onLogin(response.data.user);
                onClose();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại!';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <Button 
                    className="close-button" 
                    icon={<CloseOutlined />} 
                    onClick={onClose}
                />
                <Form className="login-form" onFinish={handleSubmit}>
                    <h2>Đăng nhập</h2>
                    <Form.Item>
                        <Input
                            type="text"
                            name="taikhoan"
                            placeholder="Tài khoản"
                            onChange={handleChange}
                            value={formData.taikhoan}
                        />
                    </Form.Item>

                    <Form.Item> 
                        <Input.Password
                            name="matkhau"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={formData.matkhau}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <div className="login-form-register"> 
                            Chưa có tài khoản? <Button type="link" onClick={onSwitchToRegister}>Đăng ký ngay</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;
