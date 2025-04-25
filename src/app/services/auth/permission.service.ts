import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ApiUrls } from 'src/app/modules/auth/services/api_urls';

export interface DataTablesResponse {
  draw?: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: any[];
}

export interface IPermissionModel {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.apiUrl = new ApiUrls().permissions;
  }

  getPermissions(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this.http.post<DataTablesResponse>(
      this.apiUrl + '-list',
      dataTablesParameters,
      { headers: this.apiService.getHeaders() }
    );
  }

  getPermission(id: number): Observable<IPermissionModel> {
    return this.http.get<IPermissionModel>(
      `${this.apiUrl}/${id}`,
      { headers: this.apiService.getHeaders() }
    );
  }

  createPermission(permission: IPermissionModel): Observable<IPermissionModel> {
    return this.http.post<IPermissionModel>(
      this.apiUrl,
      permission,
      { headers: this.apiService.getHeaders() }
    );
  }

  updatePermission(id: number, permission: IPermissionModel): Observable<IPermissionModel> {
    return this.http.put<IPermissionModel>(
      `${this.apiUrl}/${id}`,
      permission,
      { headers: this.apiService.getHeaders() }
    );
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.apiService.getHeaders() }
    );
  }
}
