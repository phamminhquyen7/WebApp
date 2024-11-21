import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HeaderMenu = ({ darkTheme, isLoggedIn, handleLogout, username, onOpenRegister, onOpenLogin }) => { 
    const navigate = useNavigate(); 

    const onLogout = () => {
        handleLogout();
        navigate('/'); 
    };

    const accountMenu = (
        <Menu>
            {isLoggedIn ? (
                <Menu.Item key="logout" onClick={onLogout}>
                    <LogoutOutlined className='icon-in_out' /> Đăng xuất
                </Menu.Item>
            ) : (
                <>
                    <Menu.Item key="login" onClick={onOpenLogin}>
                        <LoginOutlined className='icon-in_out' /> Đăng nhập
                    </Menu.Item>
                    <Menu.Item key="register" onClick={onOpenRegister}>
                        <LoginOutlined className='icon-in_out' /> Đăng ký 
                    </Menu.Item>
                </>
            )}
        </Menu>
    );

    return (
        <div className="header-menu">
            <Dropdown overlay={accountMenu} placement="bottomRight">
                <Button icon={<UserOutlined />}>
                    {isLoggedIn ? username : 'Tài khoản'}
                </Button>
            </Dropdown>
        </div>
    );
};

export default HeaderMenu;
