
export interface UserForm {
    id:number
    username: string;
    password: string;
    roleType: string;
    name: string;
    address: string;
    phoneNumber: string;
  }
  
  export interface User {
    id:number
    username: string;
    password: string;
    roleType: string;
    name: string;
    address: string;
    phoneNumber: string;
  }
  export interface LoginForm {
    username: string;
    password: string;
    roleType: string;
  }