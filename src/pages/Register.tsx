import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container } from '@mui/material';
import { addUser, getAllUsers } from '../utils/localForage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../utils/Loader';
import { UserForm } from '../utils/interface';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<UserForm, 'id'>>({
    username: '',
    password: '',
    roleType: 'user',
    name: '',
    address: '',
    phoneNumber: '',
  });
  const [isAdminPresent, setIsAdminPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidLength,setIsValidLength]=useState<boolean>(false);

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     const users = await getAllUsers();
  //     setIsAdminPresent(users.some(user => user.roleType === 'admin'));
  //   };
  //   checkAdmin();
  // }, []);
    useEffect(() => {
    const checkAdmin = async () => {
      const users = await getAllUsers();
      let count=0;
      const size = users.length;
      setIsAdminPresent(users.some(user => user.roleType === 'admin'));
      for(let i=0;i<size;i++){
        if(users[i].roleType==='user'){
          count++;
        }
      }
      if(count>=5) setIsValidLength(true);
    };
    checkAdmin();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown }>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name!]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      if (form.roleType === 'admin' && isAdminPresent) {
        toast.error('Admin already registered!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
        });
        setLoading(false);
        return;
      }
      const newUser: UserForm = { ...form, id: 0 }; 
      console.log(newUser);
      addUser(newUser);
      toast.success('Successful Registration!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
      });
      navigate("/login");
      setLoading(false);
    }, 2000);
  };

  const changePage = () => {
    navigate("/login");
  };

  return (
    <Container>
      <h2>Signup Page</h2>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField required label="Username" name="username" value={form.username} onChange={handleChange} fullWidth />
          <TextField required label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Role Type</InputLabel>
            <Select name="roleType" value={form.roleType} onChange={handleChange}>
              <MenuItem value="admin" disabled={isAdminPresent}>Admin</MenuItem>
              <MenuItem value="user" disabled ={isValidLength}>User</MenuItem>
            </Select>
          </FormControl>
          <TextField required label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField required label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
          <TextField required label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" color="primary">Signup</Button>
          <Button variant="contained" color="secondary" sx={{ margin: "30px" }} onClick={changePage}>Login</Button>
        </form>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Signup;
