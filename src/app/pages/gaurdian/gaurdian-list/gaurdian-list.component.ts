import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-gaurdian-list",
  templateUrl: "./gaurdian-list.component.html",
  styleUrl: "./gaurdian-list.component.scss",
})
export class GaurdianListComponent implements OnInit {
  gaurdianList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showAddGuardian = false;
  showEditGuardian = false;
  showDeleteGuardian = false;
  showViewChildren = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    if (this.user.type != "super_admin") {
      this.showAddGuardian =
        this.permissionList?.includes("create-guardians");
      this.showEditGuardian =
        this.permissionList?.includes("update-guardians");
     this.showDeleteGuardian =
        this.permissionList?.includes("delete-guardians");
     this.showViewChildren =
        this.permissionList?.includes("view-children");
    } else {
      this.showAddGuardian = true;
      this.showEditGuardian = true;
      this.showDeleteGuardian = true;
      this.showViewChildren = true;
    }
  }
  ngOnInit(): void {
    this.getGaurdians();
  };

  getGaurdians(){
    this.apiService.getGaurdians().subscribe(
      (res) => {

        this.gaurdianList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  };
  deleteGaurdians(id: any) {
    this.apiService.deleteGaurdian(id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('gaurdianDeletedSuccessfully'));
        this.getGaurdians()
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

        this.cdr.detectChanges();
      }
    );
  }
}
