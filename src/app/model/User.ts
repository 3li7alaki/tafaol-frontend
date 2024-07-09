export class User {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    email_verified_at: string;
    is_active: string;
    timezone: string;
    role: string;
    token: string;
    photo:string;
    auth: any

    deserialize(input: any) {
        Object.assign(this, input);
       
        return this;
      }
}