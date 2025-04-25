import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-nationality-list",
  templateUrl: "./nationality-list.component.html",
  styleUrl: "./nationality-list.component.scss",
})
export class NationalityListComponent implements OnInit {
  nationalityList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showAddNationalites = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate : TranslateService
  ) {
    if (this.user.type != "super_admin") {
      this.showAddNationalites =
        this.permissionList?.includes("create-nationalities");
    } else {
      this.showAddNationalites = true;
    }
  }

  ngOnInit(): void {
    this.apiService.getNationalites().subscribe(
      (res) => {

        this.nationalityList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
}
