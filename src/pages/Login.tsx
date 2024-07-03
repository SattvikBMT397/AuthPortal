import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container } from '@mui/material';
import { getAllUsers } from '../utils/localForage';
import { useAuth } from '../Contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../utils/Loader';
import { UserForm } from '../utils/interface';

const Login: React.FC = () => {
  const [form, setForm] = useState<Omit<UserForm, 'id'>>({ username: '', password: '', roleType: 'user', name: '', address: '', phoneNumber: '' });
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown }>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name!]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      const users = await getAllUsers();
      const user = users.find(u => u.username === form.username);
      if (user && user.password === form.password && user.roleType === form.roleType) {
        login(user);
        toast.success('Login Successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
        });
        if (form.roleType === 'admin') {
          navigate('/admin');
        } else {
          navigate(`/profile/${user.id}`);
        }
      } else {
        toast.error('Invalid username or password!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
        });
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <Container>
      <h2>Login</h2>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField required label="Username" name="username" value={form.username} onChange={handleChange} fullWidth />
          <TextField required label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Role Type</InputLabel>
            <Select name="roleType" value={form.roleType} onChange={handleChange}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">Login</Button>
        </form>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Login;
