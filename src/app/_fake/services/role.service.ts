import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { IPermissionModel } from "./permission.service";
import { IUserModel } from "./user-service";
import { ApiUrls } from "src/app/modules/auth/services/api_urls";
import { User } from "src/app/model/User";
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
  private apiUrl = new ApiUrls().roles;
  // private apiUrl = 'http://127.0.0.1:8000/api/v1/roles';

  constructor(private http: HttpClient) {}
  getHeaders(): HttpHeaders {
    const headerWithToken = new HttpHeaders({
      Accept: "application/json",
      Authorization:
        "Bearer" +
        " " +
        new User().deserialize(JSON.parse(localStorage.getItem("user")!)).auth
          .accessToken,
    });
    return headerWithToken;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${error.error.error}`
      );
      console.log(error);
    }
    if (error.error.message === "Unauthenticated.") {
      localStorage.clear();
      window.location.href = "/#/auth/login";
    }
    console.log(error.error.message);
    return throwError(error.error.error);
  }

  getUsers(
    id: number,
    dataTablesParameters: any
  ): Observable<DataTablesResponse> {
    const url = `${this.apiUrl}/${id}/users`;
    return this.http.post<DataTablesResponse>(url, dataTablesParameters);
  }

  getRoles(dataTablesParameters?: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  getPermissions(): Observable<any> {
    const url = `${new ApiUrls().permissions}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getOneRole(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().roles + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  addRole(value: any): Observable<any> {
    const body = {
      name: value.name,
      permissions: value.permissions,
    };
    return this.http
      .post<any>(new ApiUrls().roles, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editRole(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      permissions: value.permissions,
    };
    return this.http
      .put<any>(new ApiUrls().roles + '/' + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteRole(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().roles + '/' + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

 

  deleteUser(role_id: number, user_id: number): Observable<void> {
    const url = `${this.apiUrl}/${role_id}/users/${user_id}`;
    return this.http.delete<void>(url);
  }
}
