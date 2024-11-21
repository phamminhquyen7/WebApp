import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Popconfirm, Form, Input, message } from 'antd';
import { Tag } from 'antd';

import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const Kiemdinh = () => {
  const [data, setData] = useState([]);
  const [isModalVisibleSign, setIsModalVisibleSign] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [formSign] = Form.useForm(); 
  const matk = localStorage.getItem("matk");

  useEffect(() => {
    fetchQuyTrinhKiemDinh();
  }, []);

  const fetchQuyTrinhKiemDinh = async () => {
    try {
      const response = await axios.get(
        `http://192.168.38.131:3000/api/quytrinhkiemdinhs`
      );
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error("Failed to fetch quytrinhkiemdinh:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quy trình kiểm định:", error);
    }
  };

  const handleSignProduct = async (values) => {
    try {
        const response = await axios.post(`http://192.168.38.131:3000/api/xacthuckiemdinh`, {
            masp: selectedProduct.masp,  
            signature: values.signature, 
            matk: matk                   
        });

        if (response.data.success) {
            message.success('Sản phẩm đã được kiểm định thành công!');
            setIsModalVisibleSign(false); 
            fetchQuyTrinhKiemDinh(); 
        } else {
            message.error('Kiểm định sản phẩm thất bại!');
        }
    } catch (error) {
        console.error('Lỗi khi kiểm định sản phẩm:', error);
        message.error('Đã xảy ra lỗi khi kiểm định sản phẩm.');
    }
};


  const handleModalSignClose = () => {
    setIsModalVisibleSign(false);
    formSign.resetFields();
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
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

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1>Kiểm định quy trình</h1>
      </div>
      <Table columns={columns} dataSource={data} rowKey="maqt" pagination={{ pageSize: 6 }} />

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

export default Kiemdinh;
