import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-admin-list",
  templateUrl: "./admin-list.component.html",
  styleUrl: "./admin-list.component.scss",
})
export class AdminListComponent implements OnInit {
  adminList: any[];
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: BsModalService,
  ) {}
  ngOnInit(): void {
    this.getAdmins()
  };
  getAdmins(){
    this.apiService.getAdmins().subscribe(
      (res) => {
        console.log(res);
        this.adminList = res;
        this.cdr.detectChanges();
        
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.message, error.status);
      }
    );
  }
  deleteAdmin(id: any) {
    this.apiService.deleteAdmin(id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('adminDeletedSuccessfully'));
        this.getAdmins()
        this.cdr.detectChanges();
        this.modalRef?.hide();
      },
      (error) => {
        this.toastr.error(error);
        console.log(error);
        this.cdr.detectChanges();
        this.modalRef?.hide();
      }
    );
  };
  openModal(template: TemplateRef<void>, id: any) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }
  decline(): void {
    this.modalRef?.hide();
  }
}
