import React, { useState, useEffect } from "react";
import { Table, Tag, Input } from "antd";
import axios from "axios";

const Truyxuatsanpham = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchQuyTrinhKiemDinh();
  }, []);

  const fetchQuyTrinhKiemDinh = async () => {
    try {
      const response = await axios.get(`http://192.168.38.131:3000/api/readalldata`);
      if (response.data.success) {
        const formattedData = response.data.data.map((item, index) => ({
          key: item.Key,
          make: item.Record.make,
          model: item.Record.model,
          colour: item.Record.colour,
          owner: item.Record.owner,
          stt: index + 1,
          status: "Đã kiểm định",
        }));
        setData(formattedData);
        setFilteredData(formattedData); // Ban đầu hiển thị tất cả dữ liệu
      } else {
        console.error("Failed to fetch data from readAlldata:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ readAlldata:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = data.filter(
      (item) =>
        item.make.toLowerCase().includes(value) ||
        item.model.toLowerCase().includes(value) ||
        item.owner.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "make",
      key: "make",
    },
    {
      title: "Mô tả",
      dataIndex: "model",
      key: "model",
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
    },
    {
      title: "Mã màu",
      dataIndex: "colour",
      key: "colour",
    },
    {
      title: "Mã quy trình",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Mã cơ sở",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="green">{status}</Tag>,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Truy xuất sản phẩm</h1>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm, mô tả hoặc chủ sở hữu"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: "16px", width: "300px" }}
      />
      <Table columns={columns} dataSource={filteredData} rowKey="key" pagination={{ pageSize: 6 }} />
    </div>
  );
};

export default Truyxuatsanpham;
