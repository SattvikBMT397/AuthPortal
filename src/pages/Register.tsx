import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Paper, Box, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addUser, getAllUsers } from '../utils/localForage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../utils/Loader';
import { UserForm } from '../utils/interface';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<Omit<UserForm, 'id'>>();
  const [isAdminPresent, setIsAdminPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidLength, setIsValidLength] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const users = await getAllUsers();
      let count = 0;
      const size = users.length;
      setIsAdminPresent(users.some(user => user.roleType === 'admin'));
      for (let i = 0; i < size; i++) {
        if (users[i].roleType === 'user') {
          count++;
        }
      }
      if (count >= 5) setIsValidLength(true);
    };
    checkAdmin();
  }, []);

  const onSubmit = async (data: Omit<UserForm, 'id'>) => {
    setLoading(true);
    setTimeout(async () => {
      if (data.roleType === 'admin' && isAdminPresent) {
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
      const newUser: UserForm = { ...data, id: 0 };
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
    <>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={changePage}
          sx={{
            position: 'fixed',
            right: '16px',
            top: '16px',
          }}
        >
          Login
        </Button>
      </div>
      <Container maxWidth="sm" style={{ marginTop: '1rem', position: "relative", height: "100vh" }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Signup Page
          </Typography>
          {loading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={2}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Username is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username ? errors.username.message : ''}
                    />
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password ? errors.password.message : ''}
                    />
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="roleType"
                  control={control}
                  defaultValue="user"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Role Type</InputLabel>
                      <Select {...field} disabled={isAdminPresent && field.value === 'admin'}>
                        <MenuItem value="admin" disabled={isAdminPresent}>Admin</MenuItem>
                        <MenuItem value="user" disabled={!isValidLength}>User</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ''}
                    />
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Address"
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address ? errors.address.message : ''}
                    />
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      type='number'
                      fullWidth
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                    />
                  )}
                />
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Signup
              </Button>
            </form>
          )}
          <ToastContainer />
        </Paper>
      </Container>
    </>
  );
};

export default Signup;
