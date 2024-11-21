import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Popconfirm, message } from 'antd'; // Thêm Popconfirm và message
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Thêm DeleteOutlined
import ThemQuytrinh from './Themquytrinh';
import axios from 'axios';

const Quytrinh = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const matk = localStorage.getItem('matk');

  useEffect(() => {
    fetchQuyTrinh();
  }, []);

  const fetchQuyTrinh = async () => {
    try {
      const response = await axios.get(`http://192.168.38.131:3000/api/quytrinhs?matk=${matk}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error('Failed to fetch quytrinh:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu quy trình:', error);
    }
  };

  const handleDelete = async (maqt) => {
    try {
      const response = await axios.delete(`http://192.168.38.131:3000/api/QuyTrinhs/${maqt}`);

      if (response.data.success) {
        message.success('Xóa quy trình thành công');
        setData(data.filter(item => item.maqt !== maqt));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa quy trình:', error);
      message.error('Quy trình đang được sử dụng');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Tên quy trình',
      dataIndex: 'tenqt',
      key: 'tenqt',
    },
    {
      title: 'Mô tả',
      dataIndex: 'motaqt',
      key: 'motaqt',
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: 'Chi tiết quy trình',
      dataIndex: 'chitietqt',
      key: 'chitietqt',
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },

    {
      title: 'Thao tác',
      key: 'action', 
      render: (text, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa quy trình này?"
          onConfirm={() => handleDelete(record.maqt)}
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

  const handleThemQuytrinhSuccess = (newQuytrinh) => {
    setData([...data, newQuytrinh]);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Quy trình</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleThemMoi}
        >
          Thêm mới quy trình
        </Button>

      </div>
      <Table columns={columns} dataSource={data} rowKey="maqt" />

      <Modal
        title="Thêm mới quy trình"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={450}
      >
        <ThemQuytrinh onSuccess={handleThemQuytrinhSuccess} matk={matk} pagination={{ pageSize: 7 }} />
      </Modal>
    </div>
  );
};

export default Quytrinh;
