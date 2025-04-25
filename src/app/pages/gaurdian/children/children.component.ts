import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrl: './children.component.scss'
})
export class ChildrenComponent implements OnInit {
  gaurdian: any;
  childrensList: any[];
  permissionList: any[] = JSON.parse(
      localStorage.getItem("permissions") || "{}"
  );
  showAddChildren = false;
  showEditChildren = false;
  showDeleteChildren = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
      private route: ActivatedRoute,
      private apiService: ApiService,
      private cdr: ChangeDetectorRef,
      private toastr: ToastrService,
      public translate: TranslateService,
      private modalService: BsModalService
  ) {
    if (this.user.type != "super_admin") {
      this.showAddChildren = this.permissionList?.includes("create-children");
      this.showEditChildren = this.permissionList?.includes("update-children");
      this.showDeleteChildren =
          this.permissionList?.includes("delete-children");
    } else {
      this.showAddChildren = true;
      this.showEditChildren = true;
      this.showDeleteChildren = true;
    }
  }
  ngOnInit(): void {
    this.gaurdian = this.route.snapshot.data.gaurdian;
    this.childrensList = this.gaurdian.children;
  }
  deleteChildrens(id: any) {
    this.apiService.deleteChildren(id).subscribe(
        (res) => {
          this.toastr.success(
              this.translate.instant("childrenDeletedSuccessfully")
          );
          window.location.reload();
          this.cdr.detectChanges();
          this.modalRef?.hide();
        },
        (error) => {
          this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

          this.modalRef?.hide();
          this.cdr.detectChanges();
        }
    );
  }
  openModal(template: TemplateRef<void>, id: any) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }
  decline(): void {
    this.modalRef?.hide();
  }
}
