import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-childrens-list",
  templateUrl: "./childrens-list.component.html",
  styleUrl: "./childrens-list.component.scss",
})
export class ChildrensListComponent implements OnInit {
  childrensList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  filteredList: any[];
  showAddChildren = false;
  showEditChildren = false;
  showDeleteChildren = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
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
    this.getChildrens();
  }
  getChildrens() {
    this.apiService.getChildrens().subscribe(
      (res) => {
        console.log(res);
        this.childrensList = res;
        this.filteredList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  deleteChildrens(id: any) {
    this.apiService.deleteChildren(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("childrenDeletedSuccessfully")
        );
        this.getChildrens();
        this.cdr.detectChanges();
        this.modalRef?.hide();
      },
      (error) => {
        this.toastr.error(error);
        console.log(error);
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

  search(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value
    // filter the childrensList based on the input value
    if (input) {
      this.filteredList = this.childrensList.filter((item: any) => {
        return (
          item.full_name.toLowerCase().includes(input.toLowerCase()) ||
          item.cpr?.toLowerCase().includes(input.toLowerCase())
        );
      });
    } else {
        this.filteredList = this.childrensList;
    }
  }
}
