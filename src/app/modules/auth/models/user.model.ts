import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  email_verified_at: string;
  is_active: string;
  timezone: string;
  role: string;
  token: string;
  photo:string;
  auth: any

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.phone_number = user.phone_number;
    this.email_verified_at = user.email_verified_at;
    this.is_active = user.is_active;
    this.timezone = user.timezone;
    this.role = user.role;
    this.token = user.token;
    this.photo = user.photo;
    this.auth = user.auth;
  }
}
