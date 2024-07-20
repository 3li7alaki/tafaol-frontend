import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiUrls } from "../modules/auth/services/api_urls";
import { UserModel } from "../modules/auth";
import { User } from "../model/User";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {}

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
    return throwError(error.error);
  }

  public headerNoToken = new HttpHeaders({
    Accept: "application/json",
  });

  doLogin(email: any, password: any) {
    return new Promise<any>((resolve, reject) => {
      const body = {
        email: email,
        password: password,
      };
      this.http
        .post<UserModel>(new ApiUrls().login, body, {
          headers: this.headerNoToken,
        })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res);
            console.log(res);
          },
          (err) => {
            console.log(err);
            reject(err.error);
          }
        );
    });
  }
  doLogout() {
    return new Promise<void>((resolve, reject) => {
      localStorage.removeItem("user");
      localStorage.removeItem("remember");
      localStorage.clear();
      resolve();
    });
  }
  register(value: any): Observable<any> {
    const body = {
      name: value.name,
      phone: value.phone,
      email: value.email,
      password: value.password,
      password_confirmation: value.password_confirmation,
    };
    return this.http
      .post<any>(new ApiUrls().registerUrl, body, {
        headers: this.headerNoToken,
      })
      .pipe(catchError(this.handleError));
  }

  getNationalites(): Observable<any> {
    const url = `${new ApiUrls().nationalityUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  addNationality(value: any): Observable<any> {
    const body = {
      name: value.name,
      name_ar: value.name_ar,
    };
    return this.http
      .post<any>(new ApiUrls().nationalityUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneNationality(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().nationalityUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editNationality(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      name_ar: value.name_ar,
    };
    return this.http
      .put<any>(new ApiUrls().nationalityUrl + "/" + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  deleteNationality(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().nationalityUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getAdmins(): Observable<any> {
    const url = `${new ApiUrls().adminUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  addAdmin(value: any): Observable<any> {
    const body = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      password_confirmation: value.password_confirmation,
      role_id: value.role_id,
    };
    return this.http
      .post<any>(new ApiUrls().adminUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneAdmin(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().adminUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editAdmin(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      password_confirmation: value.password_confirmation,
      role_id: value.role_id,
    };
    return this.http
      .put<any>(new ApiUrls().adminUrl + "/" + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  deleteAdmin(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().adminUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getGaurdians(): Observable<any> {
    const url = `${new ApiUrls().garduainUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  deleteGaurdian(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().garduainUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addGaurdian(value: any): Observable<any> {
    const body = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      password_confirmation: value.password_confirmation,
    };
    return this.http
      .post<any>(new ApiUrls().garduainUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneGaurdian(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().garduainUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editGaurdian(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      password_confirmation: value.password_confirmation,
    };
    return this.http
      .put<any>(new ApiUrls().garduainUrl + "/" + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getChildrens(): Observable<any> {
    const url = `${new ApiUrls().childrenUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  deleteChildren(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().childrenUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addChildren(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().childrenUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneChild(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().childrenUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  editChildren(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().childrenUrl + "/" + id + "?_method=PUT", value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addChildrenData(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().childrenUrl + "/" + id + "/data-file", value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  editChildrenData(value: any, id: any, put: boolean): Observable<any> {
    let method = put ? "PUT" : "POST";
    return this.http
      .post<any>(
        new ApiUrls().childrenUrl + "/" + id + "/data-file" + "?_method=" + method,
        value,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getOneChildData(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().childrenUrl + "/" + id + "/data-file", {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneChildDiagnose(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().childrenUrl + "/" + id + "/diagnoses", {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneChildDiagnoseEdit(id: any, diagnoseID: any): Observable<any> {
    return this.http
      .get<any>(
        new ApiUrls().childrenUrl + "/" + id + "/diagnoses/" + diagnoseID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  addChildrenDiagnose(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().childrenUrl + "/" + id + "/diagnoses", value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editChildrenDiagnose(value: any, id: any, diagnoseID: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenUrl +
          "/" +
          id +
          "/diagnoses/" +
          diagnoseID +
          "?_method=PUT",
        value,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  deleteChildrenDiagnose(id: any, diagnoseID: any): Observable<any> {
    return this.http
      .delete<any>(
        new ApiUrls().childrenUrl + "/" + id + "/diagnoses/" + diagnoseID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getOneChildProgram(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().childrenUrl + "/" + id + "/programs", {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addChildProgram(body: any, id: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().childrenUrl + "/" + id + "/programs", body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  deleteChildrenProgram(id: any, programID: any): Observable<any> {
    return this.http
      .delete<any>(
        new ApiUrls().childrenUrl + "/" + id + "/programs/" + programID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getOneChildProgramsEdit(id: any, programsID: any): Observable<any> {
    return this.http
      .get<any>(
        new ApiUrls().childrenUrl + "/" + id + "/programs/" + programsID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  editChildProgram(body: any, id: any, programID: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenUrl +
          "/" +
          id +
          "/programs/" +
          programID +
          "?_method=PUT",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getChildStatus(id: any, programsID: any): Observable<any> {
    return this.http
      .get<any>(
        new ApiUrls().childrenProgramsUrl + "/" + programsID + "/history",
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  addChildStatus(body: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/history",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getOneChildStatusEdit(id: any, programsID: any): Observable<any> {
    return this.http
      .get<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/history/" + programsID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  ChildStatusEdit(id: any, programsID: any, body: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenProgramsUrl +
          "/" +
          programsID +
          "/history/" +
          id +
          "?_method=PUT",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  deleteChildStatus(id: any, programsID: any): Observable<any> {
    return this.http
      .delete<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/history/" + programsID,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  addChildProgramShcedule(body: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/scheduleEvaluation",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getChildProgramEvaluation(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().childrenProgramsUrl + "/" + id + "/evaluation", {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addChildProgramEvaluation(body: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/evaluation",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  editChildProgramEvaluation(body: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().childrenProgramsUrl +
          "/" +
          id +
          "/evaluation" +
          "?_method=PUT",
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  deleteChildProgramEvaluation(id: any): Observable<any> {
    return this.http
      .delete<any>(
        new ApiUrls().childrenProgramsUrl + "/" + id + "/evaluation",
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getQuestions(): Observable<any> {
    const url = `${new ApiUrls().questionsUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  deleteQuestion(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().questionsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addQuestion(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().questionsUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneQuestion(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().questionsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editQuestions(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().questionsUrl + "/" + id + "?_method=PUT",
        value,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getDiagnoses(): Observable<any> {
    const url = `${new ApiUrls().diagnosesUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  deleteDiagnoses(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().diagnosesUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addDiagnoses(value: any): Observable<any> {
    const body = {
      name: value.name,
      description: value.description,
    };
    return this.http
      .post<any>(new ApiUrls().diagnosesUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneDiagnose(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().diagnosesUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editDiagnoses(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      description: value.description,
    };
    return this.http
      .put<any>(new ApiUrls().diagnosesUrl + "/" + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getEvalutaions(): Observable<any> {
    const url = `${new ApiUrls().evaluationsUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  addEvalutaions(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().evaluationsUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneEvalutaion(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().evaluationsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editEvalutaions(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(
        new ApiUrls().evaluationsUrl + "/" + id + "?_method=PUT",
        value,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }
  deleteEvaluation(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().evaluationsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getStatus(): Observable<any> {
    const url = `${new ApiUrls().statusUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  addStatus(value: any): Observable<any> {
    const body = {
      name: value.name,
      name_ar: value.name_ar,
    };
    return this.http
      .post<any>(new ApiUrls().statusUrl, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneStatus(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().statusUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editStatus(value: any, id: any): Observable<any> {
    const body = {
      name: value.name,
      name_ar: value.name_ar,
    };
    return this.http
      .put<any>(new ApiUrls().statusUrl + "/" + id, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  deleteStatus(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().statusUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getPrograms(): Observable<any> {
    const url = `${new ApiUrls().programsUrl}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
  addProgram(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().programsUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getOneProgram(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().programsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editProgram(value: any, id: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().programsUrl + "/" + id + "?_method=PUT", value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  deleteProgram(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().programsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  };
  getProgramReport(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().programsReportUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getAttachments(id: any): Observable<any> {
    const url = `${new ApiUrls().programsUrl}`;
    return this.http
    .get<any>(new ApiUrls().childrenUrl + "/" + id + "/attachments", {
      headers: this.getHeaders(),
    })
    .pipe(catchError(this.handleError));
  }
  deleteAttachment(id: any): Observable<any> {
    return this.http
      .delete<any>(new ApiUrls().attachmentsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  addAttachment(value: any): Observable<any> {
    return this.http
      .post<any>(new ApiUrls().attachmentsUrl, value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  editAttachment(value: any, id: any): Observable<any> {
    // put request
    return this.http
      .post<any>(new ApiUrls().attachmentsUrl + "/" + id + "?_method=PUT", value, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  showAttachment(id: any): Observable<any> {
    return this.http
      .get<any>(new ApiUrls().attachmentsUrl + "/" + id, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
