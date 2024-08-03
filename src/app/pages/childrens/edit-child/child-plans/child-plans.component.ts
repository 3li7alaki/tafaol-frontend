import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {AddAttachmentsComponent} from "../child-attachments/add-attachments/add-attachments.component";
import {EditAttachmentsComponent} from "../child-attachments/edit-attachments/edit-attachments.component";

@Component({
  selector: 'app-child-plans',
  templateUrl: './child-plans.component.html',
  styleUrl: './child-plans.component.scss'
})
export class ChildPlansComponent implements OnInit {
  attachmentList: any[];
  // programList: any[];
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
    this.apiService.getPlans(id).subscribe(
        (res) => {
          console.log(res);
          this.attachmentList = res;
          console.log(this.attachmentList);
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error.message, error.status);
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
              console.log(res);
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
              console.log(error.message);
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
          this.toastr.error(error);
          console.log(error);
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

