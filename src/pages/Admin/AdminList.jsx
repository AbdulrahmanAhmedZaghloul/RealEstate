// pages/Admin/AdminList.jsx
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { useAuth } from "../../context/authContext";
import { useAdmins } from "../../hooks/queries/Admin/useAdmins";
import { useAddAdmin } from "../../hooks/queries/Admin/useAddAdmin";
import { useUpdateAdmin } from "../../hooks/queries/Admin/useUpdateAdmin";
import { useDeleteAdmin } from "../../hooks/queries/Admin/useDeleteAdmin";

// Import hooks
// import { useAdmins } from "../../hooks/queries/useAdmins";
// import { useAddAdmin } from "../../hooks/queries/useAddAdmin";
// import { useUpdateAdmin } from "../../hooks/queries/useUpdateAdmin";
// import { useDeleteAdmin } from "../../hooks/queries/useDeleteAdmin";

const AdminList = () => {
  const { user } = useAuth();

  // Queries & Mutations
  const { data: admins = [], isLoading } = useAdmins(user?.token);
  const { mutate: addAdmin } = useAddAdmin(user?.token);
  const { mutate: updateAdmin } = useUpdateAdmin(user?.token);
  const { mutate: deleteAdmin } = useDeleteAdmin(user?.token);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form] = Form.useForm();

  // Open modal for add
  const handleAddAdmin = () => {
    form.resetFields();
    setEditMode(false);
    setIsModalVisible(true);
  };

  // Open modal for edit
  const handleEditAdmin = (admin) => {
    form.setFieldsValue({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      phone: admin.phone,
      status: admin.status,
    });
    setSelectedAdmin(admin);
    setEditMode(true);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDeleteAdmin = (id) => {
    deleteAdmin(id, {
      onSuccess: () => {
        message.success("Admin deleted successfully.");
      },
      onError: () => {
        message.error("Failed to delete admin.");
      },
    });
  };
const handleSubmit = (values) => {
  const cleanedValues = { ...values };

  // إذا كان في وضع التعديل، احذف password من البيانات (حتى لو وُجد)
  if (editMode) {
    delete cleanedValues.password;
  }

  if (editMode) {
    updateAdmin(
      { id: selectedAdmin.id, updatedData: cleanedValues },
      {
        onSuccess: () => {
          message.success("Admin updated successfully.");
          setIsModalVisible(false);
          form.resetFields();
        },
        onError: () => {
          message.error("Failed to update admin.");
        },
      }
    );
  } else {
    addAdmin(cleanedValues, {
      onSuccess: () => {
        message.success("Admin added successfully.");
        setIsModalVisible(false);
        form.resetFields();
      },
      onError: () => {
        message.error("Failed to add admin.");
      },
    });
  }
};
  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "active" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "last_login_at",
      key: "last_login_at",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={() => handleEditAdmin(record)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteAdmin(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Admins List</h1>
      <Button
        type="primary"
        onClick={handleAddAdmin}
        style={{ marginBottom: "16px" }}
      >
        Add Admin
      </Button>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={admins}
        rowKey="id"
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editMode ? "Edit Admin" : "Add New Admin"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>

          {editMode ? null : (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Button, Modal, Form, Input, Select, message } from "antd";
// import { useAuth } from "../../context/authContext";
// import axiosInstance from "../../api/config";

// const AdminList = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editMode, setEditMode] = useState(false); // true for edit, false for add
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [form] = Form.useForm();
//   const { user } = useAuth();

//   // Fetch admins data
//   useEffect(() => {
//     const fetchAdmins = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "admin/admins",
//           {
//             headers: { Authorization: `Bearer ${user.token}` },
//           }
//         );
//         setAdmins(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching admins:", error);
//         message.error("Failed to load admins. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchAdmins();
//   }, []);

//   // Open modal for adding a new admin
//   const handleAddAdmin = () => {
//     form.resetFields();
//     setEditMode(false);
//     setIsModalVisible(true);
//   };

//   // Open modal for editing an existing admin
//   const handleEditAdmin = (admin) => {
//     form.setFieldsValue({
//       name: admin.name,
//       email: admin.email,
//       phone: admin.phone,
//       status: admin.status,
//     });
//     setSelectedAdmin(admin);
//     setEditMode(true);
//     setIsModalVisible(true);
//   };

//   // Handle delete admin
//   const handleDeleteAdmin = async (id) => {
//     try {
//       await axiosInstance.delete(`admin/admins/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       message.success("Admin deleted successfully.");
//       setAdmins(admins.filter((admin) => admin.id !== id));
//     } catch (error) {
//       console.error("Error deleting admin:", error);
//       message.error("Failed to delete admin. Please try again.");
//     }
//   };

//   // Handle form submission (add or edit)
//   const handleSubmit = async (values) => {
//     try {
//       if (editMode) {
//         // Update existing admin
//         await axiosInstance.put(
//           `admin/admins/${selectedAdmin.id}`,
//           {
//             headers: { Authorization: `Bearer ${user.token}` },
//           },
//           values
//         );
//         message.success("Admin updated successfully.");
//       } else {
//         // Add new admin
//         await axiosInstance.post(
//           "admin/admins",
//           {
//             headers: { Authorization: `Bearer ${user.token}` },
//           },
//           values
//         );
//         message.success("Admin added successfully.");
//       }

//       // Close modal and refresh list
//       setIsModalVisible(false);
//       form.resetFields();
//       setEditMode(false);
//       setSelectedAdmin(null);
//       setLoading(true);
//       const response = await axiosInstance.get("admin/admins", {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setAdmins(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       message.error("Failed to save admin. Please try again.");
//     }
//   };

//   // Columns for the table
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <span style={{ color: status === "active" ? "green" : "red" }}>
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: "Last Login",
//       dataIndex: "last_login_at",
//       key: "last_login_at",
//       render: (date) => (date ? new Date(date).toLocaleString() : "-"),
//     },
//     {
//       title: "Created At",
//       dataIndex: "created_at",
//       key: "created_at",
//       render: (date) => new Date(date).toLocaleString(),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <div>
//           <Button
//             type="link"
//             onClick={() => handleEditAdmin(record)}
//             style={{ marginRight: "8px" }}
//           >
//             Edit
//           </Button>
//           <Button
//             type="link"
//             danger
//             onClick={() => handleDeleteAdmin(record.id)}
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h1>Admins List</h1>
//       <Button
//         type="primary"
//         onClick={handleAddAdmin}
//         style={{ marginBottom: "16px" }}
//       >
//         Add Admin
//       </Button>
//       <Table
//         loading={loading}
//         columns={columns}
//         dataSource={admins}
//         rowKey={(record) => record.id}
//       />

//       {/* Modal for Add/Edit Admin */}
//       <Modal
//         title={editMode ? "Edit Admin" : "Add New Admin"}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form form={form} onFinish={handleSubmit}>
//           <Form.Item
//             label="Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter admin name" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter admin email" },
//               { type: "email", message: "Please enter a valid email" },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Phone"
//             name="phone"
//             rules={[{ required: true, message: "Please enter admin phone" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Status"
//             name="status"
//             rules={[{ required: true, message: "Please select admin status" }]}
//           >
//             <Select>
//               <Select.Option value="active">Active</Select.Option>
//               <Select.Option value="inactive">Inactive</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminList;
