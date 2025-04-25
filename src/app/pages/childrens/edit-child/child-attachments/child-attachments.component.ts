import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
// import { AddProgramsComponent } from "./add-programs/add-programs.component";
import { AddAttachmentsComponent } from "./add-attachments/add-attachments.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { EditProgramsComponent } from "./edit-programs/edit-programs.component";
import { Router } from "@angular/router";
import { EditAttachmentsComponent } from "./edit-attachments/edit-attachments.component";


@Component({
  selector: 'app-child-attachments',
  templateUrl: './child-attachments.component.html',
  styleUrl: './child-attachments.component.scss'
})
export class ChildAttachmentsComponent implements OnInit {
  attachmentList: any[];
  child: any;
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: BsModalService,
    private modalService2: NgbModal,
    private router: Router
  ) {
    this.child = JSON.parse(localStorage.getItem("children")!);
  }

  ngOnInit(): void {
    // this.getPrograms();
    this.getAttachment(this.child.id);
  }
  getAttachment(id: any) {
    this.apiService.getAttachments(id).subscribe(
      (res) => {

        this.attachmentList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  open() {
    const modalRef = this.modalService2.open(AddAttachmentsComponent, {
      windowClass: "animated fadeInDown",
      size: "xl",
      centered: true,
    });

    modalRef.result.then(
      (data) => {
        this.getAttachment(this.child.id);
      },
      (reason) => {}
    );
  }
  openEdit(id: any) {
    this.apiService.showAttachment(id).subscribe(
        (res) => {

          localStorage.setItem("oneAttachment", JSON.stringify(res));
          this.cdr.detectChanges();

          const modalRef = this.modalService2.open(EditAttachmentsComponent, {
            windowClass: "animated fadeInDown",
            size: "xl",
            centered: true,
          });
          modalRef.result.then(
              (data) => {
                this.getAttachment(this.child.id);
              },
              (reason) => {}
          );
        },
        (error) => {
          this.cdr.detectChanges();
        }
    );
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
  deleteAttachment(id: any) {
    this.apiService.deleteAttachment(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("attachmentDeletedSuccessfully")
        );
        this.getAttachment(this.child.id);
        this.cdr.detectChanges();
        this.modalRef?.hide();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

        this.cdr.detectChanges();
        this.modalRef?.hide();
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
