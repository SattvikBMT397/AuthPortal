import {useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Box, Paper, Typography } from '@mui/material';
import { getAllUsers } from '../utils/localForage';
import { useAuth } from '../Contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../utils/Loader';
import { UserForm } from '../utils/interface';

const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<Omit<UserForm, 'id'>>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Omit<UserForm, 'id'>) => {
    setLoading(true);
    setTimeout(async () => {
      const users = await getAllUsers();
      const user = users.find(u => u.username === data.username);
      if (user && user.password === data.password && user.roleType === data.roleType) {
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
        if (data.roleType === 'admin') {
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
    <Container maxWidth="sm" style={{ marginTop: '5rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Login
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
                    <Select {...field}>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
        )}
        <ToastContainer />
      </Paper>
    </Container>
  )
};

export default Login;
