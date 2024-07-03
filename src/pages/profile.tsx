import React, { useState, useEffect } from 'react';
import { DialogContent, DialogActions, Dialog, DialogTitle, TextField, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getUser, updateUser } from '../utils/localForage';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { UserForm } from '../utils/interface';

const Profile: React.FC = () => {
  const [currentuser, setCurrentuser] = useState<UserForm | null>(null);
  const { id } = useParams<{ id: string }>();
  const [editedUser, setEditedUser] = useState<UserForm | null>(null);
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser(Number(id));
      setCurrentuser(user || null);
    };
    fetchUserData();
  }, [id]);

  if (!currentuser) {
    return <div>Loading...</div>;
  }

  if (currentUser && currentUser.roleType !== 'admin' && currentUser.id !== currentuser.id) {
    return <div>You do not have permission to view this profile.</div>;
  }

  const handleEdit = () => {
    setEditedUser({ ...currentuser });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value } as UserForm);
  };

  const handleSave = async () => {
    if (editedUser) {
      await updateUser(currentuser.id, editedUser);
      setCurrentuser(editedUser);
      setOpen(false);
    }
  };

  const userDetails = [
    { label: 'Username', value: currentuser.username },
    { label: 'Password', value: currentuser.password },
    { label: 'Role Type', value: currentuser.roleType },
    { label: 'Name', value: currentuser.name },
    { label: 'Address', value: currentuser.address },
    { label: 'Phone Number', value: currentuser.phoneNumber },
  ];

  return (
    <Container>
      <h2>User Profile</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Detail</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userDetails.map(detail => (
              <TableRow key={detail.label}>
                <TableCell>{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={handleEdit}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          {/* <TextField
            margin="dense"
            label="Role Type"
            name="roleType"
            value={editedUser?.roleType}
            onChange={handleChange}
            fullWidth
          /> */}
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

export default Profile;
