import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { Button } from 'antd';

const ThemeButton = ({ darkTheme, toggleTheme }) => {
    return (
        <div className="toggle-theme-btn">
            <Button className="butt" onClick={toggleTheme}>
                {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
            </Button>
        </div>
    );
};

export default ThemeButton;
