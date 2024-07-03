import React, { useEffect, useState } from 'react';
// import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Container, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getAllUsers,updateUser } from '../utils/localForage';
import { UserForm } from '../utils/interface';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserForm[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserForm | null>(null);
  const [editedUser, setEditedUser] = useState<UserForm| null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      const nonAdmin= allUsers.filter(user=>user.roleType!=='admin');
      setUsers(nonAdmin);
    };
    fetchUsers();
  }, []);
  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    await updateUser(selectedUser.username, editedUser);
    setUsers(users.map(user => (user.username === selectedUser.username ? editedUser : user)));
    setOpen(false);
  };
  return (
    <Container>
      <h2>User List</h2>
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Username: ${user.username}, Role: ${user.roleType}`}
              secondary={`Name: ${user.name}, Address: ${user.address}, Phone: ${user.phoneNumber}`}
            />
            <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
              Edit
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={editedUser?.username}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={editedUser?.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Role Type"
            name="roleType"
            value={editedUser?.roleType}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editedUser?.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={editedUser?.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone Number"
            name="phoneNumber"
            value={editedUser?.phoneNumber}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
