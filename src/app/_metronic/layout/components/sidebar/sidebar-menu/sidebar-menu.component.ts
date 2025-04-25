import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
  styleUrls: ["./sidebar-menu.component.scss"],
})
export class SidebarMenuComponent implements OnInit {
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showRoles = false;
  showNationalites = false;
  showAdmin = false;
  showGaurdian = false;
  showChildrens = false;
  showQuestions = false;
  showEvaluation = false;
  showForms = false;
  showStatus = false;
  showPrograms = false;
  showDiagnose = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor() {
    if (this.user.type != "super_admin") {
      this.showRoles = this.permissionList?.includes("role-management");
      this.showAdmin = this.permissionList?.includes("admin-management");
      this.showGaurdian = this.permissionList?.includes("view-guardians");
      this.showChildrens = this.permissionList?.includes("view-children");
      this.showQuestions = this.permissionList?.includes("view-questions");
      this.showStatus = this.permissionList?.includes("view-statuses");
      this.showPrograms = this.permissionList?.includes("view-programs");
      this.showEvaluation = this.permissionList?.includes("view-evaluations");
      this.showForms = this.permissionList?.includes("view-forms");
      this.showDiagnose = this.permissionList?.includes("view-children-diagnoses");
      this.showNationalites = this.permissionList?.includes("view-nationalities");
    } else {
      this.showRoles = true;
      this.showAdmin = true;
      this.showGaurdian = true;
      this.showChildrens = true;
      this.showQuestions = true;
      this.showStatus = true;
      this.showPrograms = true;
      this.showEvaluation = true;
      this.showForms = true;
      this.showDiagnose = true;
      this.showNationalites = true;
    }
  }

  ngOnInit(): void {}
}
