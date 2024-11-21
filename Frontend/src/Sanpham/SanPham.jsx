import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import ThemSanPham from './ThemSanPham';
import axios from 'axios';

const SanPham = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleSign, setIsModalVisibleSign] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formSign] = Form.useForm();
  const matk = localStorage.getItem('matk');

  useEffect(() => {
    fetchSanPham();
  }, []);

  const fetchSanPham = async () => {
    try {
      const response = await axios.get(`http://192.168.38.131:3000/api/SanPhams?matk=${matk}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error('Failed to fetch sản phẩm:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
  };

  const handleDelete = async (masp) => {
    try {
      const response = await axios.delete(`http://192.168.38.131:3000/api/SanPhams/${masp}`);
      if (response.data.success) {
        message.success('Xóa sản phẩm thành công');
        setData(data.filter(item => item.masp !== masp));
      } else {
        message.error('Xóa sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const handleSignProduct = async (values) => {
    try {
      const response = await axios.post(`http://192.168.38.131:3000/api/signSanPham`, {
        masp: selectedProduct.masp,
        signature: values.signature,
        matk: matk
      });
      if (response.data.success) {
        message.success('Sản phẩm đã được gửi đi kiểm định!');
        setIsModalVisibleSign(false);
        fetchSanPham(); 
      } else {
        message.error(' Gửi kiểm định thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi kiểm định:', error);
    }
  };
  

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tensp',
      key: 'tensp',
    },
    {
      title: 'Mô tả',
      dataIndex: 'motasp',
      key: 'motasp',
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: 'Quy trình',
      dataIndex: 'maqt',
      key: 'maqt',
    },
    {
      title: 'Cơ sở sản xuất',
      dataIndex: 'macoso',
      key: 'macoso',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'trangthaiqt',
      key: 'trangthaiqt',
      render: (trangthaiqt) => {
        let color;
        if (trangthaiqt === 'Chưa kiểm định') {
          color = 'gray';
        } else if (trangthaiqt === 'Đang kiểm định') {
          color = 'orange';
        } else if (trangthaiqt === 'Đã kiểm định') {
          color = 'green';
        }
        return <Tag color={color}>{trangthaiqt}</Tag>;
      },
    },
    
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.masp)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            style={{ marginLeft: '8px' }}
            onClick={() => {
              setSelectedProduct(record);
              setIsModalVisibleSign(true);
            }}
          >
            Kiểm định
          </Button>
        </div>
      ),
    },
  ];

  const handleThemMoi = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalSignClose = () => {
    setIsModalVisibleSign(false);
    formSign.resetFields();
  };

  const handleThemSanPhamSuccess = (newSanPham) => {
    setData([...data, newSanPham]);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Sản phẩm</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleThemMoi}
        >
          Thêm mới sản phẩm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="masp" pagination={{ pageSize: 6 }} />

      <Modal
        title="Thêm mới sản phẩm"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={450}
      >
        <ThemSanPham onSuccess={handleThemSanPhamSuccess} matk={matk} />
      </Modal>

      <Modal
        title="Yêu cầu kiểm định sản phẩm"
        visible={isModalVisibleSign}
        onCancel={handleModalSignClose}
        footer={null}
        width={450}
      >
        <Form
          form={formSign}
          layout="vertical"
          onFinish={handleSignProduct}
        >
          <Form.Item
            name="signature"
            label="Khóa bí mật"
            rules={[{ required: true, message: 'Vui lòng nhập khóa bí mật!' }]}
          >
            <Input.Password placeholder="Nhập Khóa bí mật" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận 
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPham;
