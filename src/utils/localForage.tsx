import localforage from 'localforage';
import { UserForm } from './interface';

const USERS_KEY = 'users';

export const addUser = async (user: UserForm): Promise<void> => {
  const users = await getAllUsers();
  user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(user);
  await localforage.setItem(USERS_KEY, users);
};

export const getAllUsers = async (): Promise<UserForm[]> => {
  const users = await localforage.getItem<UserForm[]>(USERS_KEY);
  return users || [];
};

export const getUser = async (id: number): Promise<UserForm | undefined> => {
  const users = await getAllUsers();
  return users.find(user => user.id === id);
};

export const updateUser = async (id: number, updatedUser: UserForm): Promise<void> => {
  const users = await getAllUsers();
  const updatedUsers = users.map(user => (user.id === id ? updatedUser : user));
  await localforage.setItem(USERS_KEY, updatedUsers);
};
