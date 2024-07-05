import React, { useEffect, useState } from 'react';
import {
  Container,
  List,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
    setEditedUser({ ...editedUser, [name]: value } as UserForm);
  };

  const handleSave = async () => {
    await updateUser(selectedUser!.id, editedUser!);
    setUsers(users.map(user => (user.username === selectedUser!.username ? editedUser : user) as UserForm));
    setOpen(false);
  };
  return(

<Container maxWidth="lg">
<Typography variant="h4" component="h1" gutterBottom>
  User List
</Typography>
<Paper elevation={3} sx={{ padding: 2 }}>
  <List>
    {users.map((user, index) => (
      <Paper
        key={index}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ListItemText
              primary={`Username: ${user.username}, Role: ${user.roleType}`}
              secondary={`Name: ${user.name}, Address: ${user.address}, Phone: ${user.phoneNumber}`}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconButton color="primary" onClick={() => handleEdit(user)}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    ))}
  </List>
</Paper>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Edit User</DialogTitle>
  <DialogContent>
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)} color="secondary">
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