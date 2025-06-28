import { environment } from "src/environments/environment";

export class ApiUrls {
  baseUrl = environment.apiUrl;
  me = this.baseUrl + "api/me";
  login = this.baseUrl + "api/login";
  roles = this.baseUrl + "admin/roles";
  users = this.baseUrl + "admin/users";
  permissions = this.baseUrl + "admin/permissions";
  nationalityUrl = this.baseUrl + "admin/nationalities";
  adminUrl = this.baseUrl + "admin/admins";
  guardianUrl = this.baseUrl + "admin/guardians";
  childrenUrl = this.baseUrl + "admin/children";
  registerUrl = this.baseUrl + "api/register";
  questionsUrl = this.baseUrl + "admin/questions";
  categoriesUrl = this.baseUrl + "admin/categories";
  diagnosesUrl = this.baseUrl + "admin/diagnoses";
  evaluationsUrl = this.baseUrl + "admin/forms";
  statusUrl = this.baseUrl + "admin/statuses";
  programsUrl = this.baseUrl + "admin/programs";
  attachmentsUrl = this.baseUrl + "admin/attachments";
  childrenProgramsUrl = this.baseUrl + "admin/childrenPrograms";
  programsReportUrl = this.baseUrl + 'admin/programsReport';
  forgotPasswordReset = this.baseUrl + 'api/forgot-password-reset';
}