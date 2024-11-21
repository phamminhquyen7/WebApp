import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Popconfirm, message } from 'antd'; // Thêm Popconfirm và message
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ThemCoSoSanXuat from './ThemCoSoSanXuat';

import axios from 'axios';

const CoSoSanXuat = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const matk = localStorage.getItem('matk');

  useEffect(() => {
    fetchCoSoSanXuat();
  }, []);

  const fetchCoSoSanXuat = async () => {
    try {
      const response = await axios.get(`http://192.168.38.131:3000/api/CoSoSanXuats?matk=${matk}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error('Failed to fetch CoSoSanXuats:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu CoSoSanXuats:', error);
    }
  };

  const handleDelete = async (macoso) => {
    try {
      const response = await axios.delete(`http://192.168.38.131:3000/api/CoSoSanXuats/${macoso}`);

      if (response.data.success) {
        message.success('Xóa cơ sở thành công');
        setData(data.filter(item => item.macoso !== macoso));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa cơ sở:', error);
      message.error('Cơ sở đang được sử dụng');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Tên cơ sở',
      dataIndex: 'tencoso',
      key: 'tencoso',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi',
      key: 'diachi',
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: 'SDT',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },

    {
      title: 'Thao tác',
      key: 'action', 
      render: (text, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa cơ sở này?"
          onConfirm={() => handleDelete(record.macoso)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
    
  ];

  const handleThemMoi = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleThemCoSoSanXuatSuccess = (newCoSoSanXuat) => {
    setData([...data, newCoSoSanXuat]);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Cơ sở sản xuất</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleThemMoi}
        >
          Thêm mới cơ sở
        </Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="macoso" pagination={{ pageSize: 6 }} />

      <Modal
        title="Thêm mới cơ sở"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={450}
      >
        <ThemCoSoSanXuat onSuccess={handleThemCoSoSanXuatSuccess} matk={matk} pagination={{ pageSize: 7 }} />
      </Modal>

    </div>
  );
};

export default CoSoSanXuat;
