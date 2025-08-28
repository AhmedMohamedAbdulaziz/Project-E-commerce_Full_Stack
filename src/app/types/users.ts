export interface IUsers {
    _id?: string;
    FirstName: string;
    LastName: string;
    email: string;
    password?: string;
    confirmPassword: string;
    token?: string;
    role?: 'user' | 'admin';
}
export interface IRegisterForm extends IUsers {
  confirmPassword: string;
}