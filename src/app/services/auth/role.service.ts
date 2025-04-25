import {
  HttpClient,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { ApiUrls } from "src/app/modules/auth/services/api_urls";
import { ApiService } from "../api.service";
import { IPermissionModel } from "./permission.service";
import { IUserModel } from "./user.service";

export interface DataTablesResponse {
  draw?: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: any[];
}

export interface IRoleModel {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  permissions: IPermissionModel[];
  users: IUserModel[];
}

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.apiUrl = new ApiUrls().roles;
  }

  getUsers(id: number, dataTablesParameters: any): Observable<DataTablesResponse> {
    const url = `${this.apiUrl}/${id}/users`;
    return this.http.post<DataTablesResponse>(
      url, 
      dataTablesParameters,
      { headers: this.apiService.getHeaders() }
    );
  }

  getRoles(dataTablesParameters?: any): Observable<any> {
    return this.http.get<any>(
      this.apiUrl,
      { headers: this.apiService.getHeaders() }
    );
  }

  getPermissions(): Observable<any> {
    const url = `${new ApiUrls().permissions}`;
    return this.http.get<any>(
      url,
      { headers: this.apiService.getHeaders() }
    );
  }

  getOneRole(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      { headers: this.apiService.getHeaders() }
    ).pipe(catchError(this.apiService.handleError));
  }

  addRole(value: any): Observable<any> {
    const body = {
      name: value.name,
      permissions: value.permissions,
    };
    return this.http.post<any>(
      this.apiUrl,
      body,
      { headers: this.apiService.getHeaders() }
    ).pipe(catchError(this.apiService.handleError));
  }

  editRole(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      permissions: value.permissions,
    };
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      body,
      { headers: this.apiService.getHeaders() }
    ).pipe(catchError(this.apiService.handleError));
  }

  deleteRole(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      { headers: this.apiService.getHeaders() }
    ).pipe(catchError(this.apiService.handleError));
  }

  deleteUser(role_id: number, user_id: number): Observable<void> {
    const url = `${this.apiUrl}/${role_id}/users/${user_id}`;
    return this.http.delete<void>(
      url,
      { headers: this.apiService.getHeaders() }
    );
  }
}
