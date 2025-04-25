import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrls } from 'src/app/modules/auth/services/api_urls';
import { ApiService } from '../api.service';
import { IRoleModel } from './role.service';

export interface DataTablesResponse {
    draw?: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: any[];
}

export interface IUserModel {
    avatar?: null | string;
    created_at?: string;
    email: string;
    email_verified_at?: string;
    id: number;
    last_login_at?: null | string;
    last_login_ip?: null | string;
    name?: string;
    profile_photo_path?: null | string;
    updated_at?: string;
    password?: string;
    roles?: IRoleModel[];
    role?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl: string;

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {
        // Use adminUrl as a base since there's no specific users endpoint
        this.apiUrl = new ApiUrls().users;
    }

    getUsers(dataTablesParameters: any): Observable<DataTablesResponse> {
        const url = `${this.apiUrl}-list`;
        return this.http.post<DataTablesResponse>(
            url, 
            dataTablesParameters,
            { headers: this.apiService.getHeaders() }
        );
    }

    getUser(id: number): Observable<IUserModel> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<IUserModel>(
            url,
            { headers: this.apiService.getHeaders() }
        );
    }

    createUser(user: IUserModel): Observable<IUserModel> {
        return this.http.post<IUserModel>(
            this.apiUrl, 
            user,
            { headers: this.apiService.getHeaders() }
        );
    }

    updateUser(id: number, user: IUserModel): Observable<IUserModel> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<IUserModel>(
            url, 
            user,
            { headers: this.apiService.getHeaders() }
        );
    }

    deleteUser(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(
            url,
            { headers: this.apiService.getHeaders() }
        );
    }
}
