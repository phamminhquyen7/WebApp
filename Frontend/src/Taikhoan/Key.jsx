import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, message, Empty, Spin } from 'antd';
import { DeleteOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const Key = () => {
    const [formkey] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isModalVisiblecheckPasswd, setIsModalVisiblecheckPasswd] = useState(false);
    const [isModalVisibleAddKey, setIsModalVisibleAddKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAddKey, setLoadingAddKey] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleDelete = async (values) => {
        try {
            const response = await axios.put(`http://192.168.38.131:3000/api/luukey/${user.matk}`, {
                tenchuky: null,
                publickey: null,
            });

            if (response.data.success) {
                const updatedUser = {
                    ...user,
                    tenchuky: null,
                    publickey: null
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                
                message.success('xóa thành công!');
            } else {
                message.error('xóa không thành công!');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi lưu khóa.');
        }
    };

    const checkPasswd = async (values) => {
        try {
            const response = await axios.post(`http://192.168.38.131:3000/api/checkpasswd/${user.matk}`, {
                password: values.matkhau
            });

            if (response.data.success) {
                setIsModalVisiblecheckPasswd(false);
                setLoading(true);
                await handletaokey(user.matk);
                setIsModalVisibleAddKey(true);
                message.success('Mật khẩu chính xác');
                passwordForm.resetFields();
            }
        } catch (error) {
            message.error(error.response?.data.message || 'Mật khẩu không chính xác!');
        } finally {
            setLoading(false);
        }
    };

    const handletaokey = async (matk) => {
        try {
            const response = await axios.post(`http://192.168.38.131:3000/api/taoKey/${matk}`);

            if (response.data.success) {
                formkey.setFieldsValue({
                    idkey: response.data.keys.id,
                    pulickey: response.data.keys.certificate,
                    privatekey: response.data.keys.privateKey
                });
                message.success('Tạo khóa thành công!');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo khóa.');
        }
    };

    const handleluukey = async (values) => {
        try {
            const response = await axios.put(`http://192.168.38.131:3000/api/luukey/${user.matk}`, {
                tenchuky: values.tenkey,
            });

            if (response.data.success) {
                const updatedUser = {
                    ...user,
                    tenchuky: values.tenkey,
                    publickey: values.pulickey
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                
                message.success('Lưu khóa thành công!');
                handleCloseAddKeyModal();
            } else {
                message.error('Lưu khóa không thành công!');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi lưu khóa.');
        }
    };

    const handleCloseAddKeyModal = () => {
        setIsModalVisibleAddKey(false);
        formkey.resetFields();
    };

    const handleClosePasswordModal = () => {
        setIsModalVisiblecheckPasswd(false);
        passwordForm.resetFields();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Đã sao chép mã bí mật vào clipboard!');
        }).catch(err => {
            message.error('Không thể sao chép mã bí mật.');
        });
    };

    const downloadPrivateKey = () => {
        const privateKey = formkey.getFieldValue('privatekey');
        const blob = new Blob([privateKey], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'private_key.pem';
        link.click();
        window.URL.revokeObjectURL(link.href);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2>Chữ ký số</h2>
                {!user.publickey && (
                    <Button
                        type="primary"
                        onClick={() => setIsModalVisiblecheckPasswd(true)}
                    >
                        Tạo chữ ký số
                    </Button>
                )}
            </div>

            {user.publickey ? (
                <Card
                    style={{ marginBottom: '16px' }}
                    actions={[
                        <DeleteOutlined
                            key="delete"
                            onClick={handleDelete}
                            style={{ color: '#ff4d4f' }} 
                        />
                    ]}
                >
                    <Card.Meta
                        title={user.tenchuky}
                        description={<p> {user.publickey}</p>}
                    />
                </Card>
            ) : (
                <Empty description="Chưa có chữ ký số nào" />
            )}

            <Modal
                title="Tạo chữ ký số"
                visible={isModalVisiblecheckPasswd}
                onCancel={handleClosePasswordModal}
                footer={null}
            >
                <Form form={passwordForm} layout="vertical" onFinish={checkPasswd}>
                    <Form.Item
                        name="matkhau"
                        label="Xác thực mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tiếp tục
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm chữ ký số mới"
                visible={isModalVisibleAddKey}
                onCancel={handleCloseAddKeyModal}
                footer={null}
            >
                {loadingAddKey ? (
                    <Spin tip="Đang lưu chữ ký..." />
                ) : (
                    <Form form={formkey} layout="vertical" onFinish={handleluukey}>
                        <Form.Item
                            name="tenkey"
                            label="Tên chữ ký"
                            rules={[{ required: true, message: 'Vui lòng nhập tên chữ ký!' }]}
                        >
                            <Input placeholder="Nhập tên chữ ký" />
                        </Form.Item>

                        <Form.Item name="pulickey" label="Mã công khai">
                            <Input.TextArea disabled />
                        </Form.Item>

                        <Form.Item name="privatekey" label="Mã bí mật">
                            <Input.TextArea disabled />
                            <Button
                                type="link"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(formkey.getFieldValue('privatekey'))}
                            >
                                Sao chép
                            </Button>
                            <Button
                                type="link"
                                icon={<DownloadOutlined />}
                                onClick={downloadPrivateKey}
                            >
                                Tải xuống
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Thêm chữ ký
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default Key;
