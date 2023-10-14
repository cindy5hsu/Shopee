// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";

// interface Member {
//   id: number;
//   name: string;
//   email: string;
//   joinDate: string;
//   address: string;
//   phoneNumber: string;
// }

// const MemberManagement: React.FC = () => {
//   const [members, setMembers] = useState<Member[]>([
//     {
//       id: 1,
//       name: "Alice",
//       email: "alice@example.com",
//       joinDate: "2022-01-01",
//       address: "123 Main St",
//       phoneNumber: "123-456-7890",
//     },
//     {
//       id: 2,
//       name: "Bob",
//       email: "bob@example.com",
//       joinDate: "2022-01-02",
//       address: "456 Elm St",
//       phoneNumber: "987-654-3210",
//     },
//   ]);

//   const [isAdding, setIsAdding] = useState(false);
//   const [newMember, setNewMember] = useState({
//     name: "",
//     email: "",
//     joinDate: "",
//     address: "",
//     phoneNumber: "",
//   });
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const handleAddNewField = () => {
//     setIsAdding(true);
//   };

//   const handleSaveNewMember = () => {
//     setMembers([...members, { id: members.length + 1, ...newMember }]);
//     setIsAdding(false);
//     setNewMember({
//       name: "",
//       email: "",
//       joinDate: "",
//       address: "",
//       phoneNumber: "",
//     });
//   };

//   const handleEdit = (id: number) => {
//     setEditingId(id);
//   };

//   const handleSaveEdit = (updatedMember: Member) => {
//     const updatedMembers = members.map((member) =>
//       member.id === updatedMember.id ? updatedMember : member
//     );
//     setMembers(updatedMembers);
//     setEditingId(null);
//   };

//   const handleDelete = (id: number) => {
//     setMembers(members.filter((member) => member.id !== id));
//   };

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import TablePagination from "@mui/material/TablePagination";//分頁

interface Member {
  userdDetailsId: number;
  // userId: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdDate: Date | string;
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(0); // 頁面的索引（從 0 開始）
  const [rowsPerPage, setRowsPerPage] = useState(6); // 每頁顯示的行數
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    createdDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
//函數負責處理頁面更改。它使用 setPage 來更新當前的頁面索引
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/usersdetails`)
      .then((response) => {
        console.log("Response data:", response.data);
        setMembers(response.data); //渲染到畫面中
        setFilteredMembers(response.data); // 将数据设置为过滤后的成员
      })
      .catch((error) => {
        console.error("There was an error fetching data", error);
      });
  }, []);

  // //  fetchMembers() 是一个获取成员列表的函数
  // useEffect(() => {
  //   fetchMembers().then(fetchedMembers => {
  //     setMembers(fetchedMembers);
  //     setFilteredMembers(fetchedMembers);
  //   });
  // }, []);

  function formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const timeOptions = {
      hour12: true,
      hour: "2-digit" as const,
      minute: "2-digit" as const,
      second: "2-digit" as const,
    };
    const time = d.toLocaleTimeString("zh-TW", timeOptions);
    return `${year}/${month}/${day} ${time}`;
  }

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const newFilteredMembers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.address.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.phone.toLowerCase().includes(lowerCaseSearchTerm)
    );

    setFilteredMembers(newFilteredMembers);
  }, [searchTerm, members]);

  // const handleAddNewField = () => {
  //   setIsAdding(true);
  // };

  const handleSaveNewMember = () => {
    setMembers([
      ...members,
      { userdDetailsId: members.length + 1, ...newMember },
    ]);
    setIsAdding(false);
    setNewMember({
      name: "",
      email: "",
      address: "",
      phone: "",
      createdDate: "",
    });
  };

  const handleEdit = (userId: number) => {
    setEditingId(userId);
  };

  // const handleSaveEdit = (updatedMember: Member) => {
  //   const updatedMembers = members.map((member) =>
  //     member.userdDetailsId === updatedMember.userdDetailsId
  //       ? updatedMember
  //       : member
  //   );
  //   setMembers(updatedMembers);
  //   setEditingId(null);
  //   try {
  //     const response = await fetch(`http://localhost:8080/user/${updatedMember.userdDetailsId}/userdetails`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         name: updatedMember.name,
  //         address: updatedMember.address,
  //         phone: updatedMember.phone
  //       })
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('更新失敗');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // 處理錯誤（例如：顯示一個錯誤消息）
  //   }
  // };

  // const handleSaveEdit = async (updatedMember: Member) => {
  //   // 更新本地狀態
  //   const updatedMembers = members.map((member) =>
  //     member.userdDetailsId === updatedMember.userdDetailsId
  //       ? updatedMember
  //       : member
  //   );
  //   setMembers(updatedMembers);
  //   setEditingId(null);
  
  //   // 向伺服器發送 PUT 請求
  //   try {
  //     const response = await fetch(`http://localhost:8080/user/${updatedMember.userdDetailsId}/userdetails`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         name: updatedMember.name,
  //         address: updatedMember.address,
  //         phone: updatedMember.phone
  //       })
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('更新失敗');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // 處理錯誤（例如：顯示一個錯誤消息）
  //   }
  // };

  const handleSaveEdit = async (updatedMember: any) => {
    // 更新本地状态
    const updatedMembers = members.map((member) =>
      member.userdDetailsId === updatedMember.userdDetailsId
        ? updatedMember
        : member
    );
    setMembers(updatedMembers);
    setEditingId(null);
  
    // 向服务器发送 PUT 请求
    try {
      const response = await axios.put(`http://localhost:8080/user/${updatedMember.userdDetailsId}/userdetails`, {
        name: updatedMember.name,
        address: updatedMember.address,
        phone: updatedMember.phone
      });
  
      // 检查响应状态
      if (response.status !== 200) {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error(error);
      // 处理错误（例如：显示一个错误消息）
    }
  };
  
  
  const handleDelete = (userId: number) => {
    setMembers(members.filter((member) => member.userdDetailsId !== userId));
  };
  const computedFilteredMembers = members.filter(
    (member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()) // 根据你的需要选择字段
  );

  // /函數允許更改每頁顯示的行數
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  // 變數包含了當前頁面應該顯示的行
  const displayProducts = computedFilteredMembers.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  return (
    <div style={{ padding: "2em" }}>
      <h1>會員管理</h1>
      <div style={{ height: "20px" }}></div>
      <Paper elevation={3}>
        {/* <Autocomplete
        options={members.map((option) => option.name)} // 选择你想要搜索的字段
        value={searchTerm}
        // onChange={(event, newValue) => {
        //   setSearchTerm(newValue);
        // }}
        onChange={(event, newValue) => {
          setSearchTerm(newValue || '');  
        }}
        renderInput={(params) => <TextField {...params} label="Search Members" />}
      /> */}
        <Autocomplete
          options={filteredMembers} // 使用已过滤的成员列表
          getOptionLabel={(option: Member) => option.name} // 你可以根据需要自定义这里
          // value={searchTerm}
          onInputChange={(event, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
          renderInput={(params) => <TextField {...params} label="搜索成員" />}
        />

        {/* <Button
          variant="contained"
          onClick={handleAddNewField}
          disabled={isAdding}
          startIcon={<AddIcon />}
          style={{ backgroundColor: "#e24c0e", color: "white", margin: "16px" }}
        >
          添加成員
        </Button> */}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>編號</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>電子郵件</TableCell>
              <TableCell>加入日期</TableCell>
              <TableCell>地址</TableCell>
              <TableCell>電話號碼</TableCell>
              <TableCell>操作選項</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayProducts.map((member) => (
              <TableRow
                key={member.userdDetailsId}
                style={{
                  backgroundColor:
                    member.userdDetailsId % 2 === 0
                      ? "rgba(0, 0, 0, 0.04)"
                      : undefined, // 这里设置您喜欢的颜色
                }}
              >
                <TableCell>{member.userdDetailsId}</TableCell>
                <TableCell>
                  {editingId === member.userdDetailsId ? (
                    <TextField
                      defaultValue={member.name}
                      onBlur={(e) =>
                        handleSaveEdit({ ...member, name: e.target.value })
                      }
                    />
                  ) : (
                    member.name
                  )}
                </TableCell>
              <TableCell>{member.email}</TableCell>

                <TableCell>{formatDate(member.createdDate)}</TableCell>

                <TableCell>
                  {editingId === member.userdDetailsId ? (
                    <TextField
                      defaultValue={member.address}
                      onBlur={(e) =>
                        handleSaveEdit({ ...member, address: e.target.value })
                      }
                    />
                  ) : (
                    member.address
                  )}
                </TableCell>
                <TableCell>
                  {editingId === member.userdDetailsId ? (
                    <TextField
                      defaultValue={member.phone}
                      onBlur={(e) =>
                        handleSaveEdit({
                          ...member,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    member.phone
                  )}
                </TableCell>
                <TableCell>
                  {editingId === member.userdDetailsId ? (
                    <IconButton
                      onClick={() => handleSaveEdit(member)}
                      color="inherit"
                    >
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleEdit(member.userdDetailsId)}
                      color="inherit"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {editingId === member.userdDetailsId ? (
                    <IconButton
                      onClick={() => setEditingId(null)}
                      color="inherit"
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleDelete(member.userdDetailsId)}
                      color="inherit"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {/* {isAdding && (
              <TableRow>
                <TableCell>
                  <TextField label="ID" value={members.length + 1} disabled />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Join Date"
                    value={newMember.createdDate}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        createdDate: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Address"
                    value={newMember.address}
                    onChange={(e) =>
                      setNewMember({ ...newMember, address: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Phone Number"
                    value={newMember.phone}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        phone: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleSaveNewMember} color="inherit">
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setIsAdding(false)}
                    color="inherit"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </Paper>
      <TablePagination
        component="div"
        count={computedFilteredMembers.length}//總行數
        page={page}//當前頁面
        onPageChange={handleChangePage} // 更改頁面時的處理函數
        rowsPerPage={rowsPerPage} // 每頁的行數
        onRowsPerPageChange={handleChangeRowsPerPage}// 更改每頁行數時的處理函數
      />
    </div>
  );
};

export default MemberManagement;
