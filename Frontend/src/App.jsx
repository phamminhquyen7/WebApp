import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Logo from './menu/Logo';
import MenuList from './menu/Menulist';
import ThemeButton from './menu/Themebutt';
import HeaderMenu from './menu/HeaderMenu';
import Login from './Taikhoan/Login';
import Register from './Taikhoan/Register';
import TrangChu from './menu/TrangChu';
import Quytrinh from './Sanpham/Quytrinh';
import CoSoSanXuat from './Sanpham/CoSoSanXuat';
import SanPham from './Sanpham/SanPham';
import Kiemdinh from './Kiemdinh/KiemDinhQuyTrinh';
import ThongTinCaNhan from './Taikhoan/ThongTinCaNhan';
import MatKhau from './Taikhoan/MatKhau';
import Key from './Taikhoan/Key';
import Truyxuatsanpham from './Truyxuatsanpham/Truyxuatsanpham';






import './index.css';

const { Sider, Header, Content } = Layout;

function App() {

  const [darkTheme, setDarkTheme] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.taikhoan);
    setUser(userData);
  };

  const handleLogout = () => {
    message.success('Đã đăng xuất!');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username') || '');
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(userData.taikhoan);
      setUser(userData);
    }
  }, []);

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <Router>
      <Layout>
        <Sider theme={darkTheme ? 'dark' : 'light'} className="sidebar">
          <Logo />
          <MenuList darkTheme={darkTheme} isLoggedIn={isLoggedIn} user={user} />
        </Sider>

        <Layout>
          <Header className={`header ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
            <HeaderMenu
              darkTheme={darkTheme}
              isLoggedIn={isLoggedIn}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              username={username}
              onOpenRegister={handleOpenRegister}
              onOpenLogin={handleOpenLogin}
            />
            <ThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
          </Header>
          <Content style={{ padding: '24px', minHeight: '280px' }}>
            <Routes>
              <Route path="/" element={<TrangChu />} />
              <Route path="/quytrinh" element={<Quytrinh />} />
              <Route path="/CoSoSanXuat" element={<CoSoSanXuat />} />
              <Route path="/SanPham" element={<SanPham />} />
              <Route path="/Kiemdinh" element={<Kiemdinh />} />
              <Route path="/ThongTinCaNhan" element={<ThongTinCaNhan />} />
              <Route path="/Matkhau" element={<MatKhau />} />
              <Route path="/Key" element={<Key />} />
              <Route path="/Truyxuatsanpham" element={<Truyxuatsanpham />} />


            </Routes>
            {showRegister && (
              <Register
                onClose={handleCloseRegister}
                onSwitchToLogin={handleOpenLogin}
              />
            )}
            {showLogin && (
              <Login
                onLogin={handleLogin}
                onClose={handleCloseLogin}
                onSwitchToRegister={handleOpenRegister}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
