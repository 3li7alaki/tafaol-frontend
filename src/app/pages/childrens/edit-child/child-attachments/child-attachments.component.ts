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
    this.apiService.getAttachments(id).subscribe(
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
  // getPrograms() {
  //   this.apiService.getOneChildProgram(this.child.id).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.programList = res;
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.toastr.error(error.error.message, error.status);
  //     }
  //   );
  // }
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
    // const modalRef = this.modalService.open(AddProgramsComponent, {
    //   windowClass: "animated fadeInDown",
    //   size: "xl",
    //   centered: true,
    // });

    // modalRef.result.then(
    //   (data) => {
    //     this.getPrograms();
    //   },
    //   (reason) => {}
    // );
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
    // const modalRef = this.modalService.open(EditProgramsComponent, {
    //   windowClass: "animated fadeInDown",
    //   size: "xl",
    //   centered: true,
    // });
    // this.apiService.getOneChildProgramsEdit(this.child.id, id).subscribe(
    //   (res) => {
    //     console.log(res);
    //     localStorage.setItem("oneChildProgram", JSON.stringify(res));
    //     this.cdr.detectChanges();
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.toastr.error(error.error.message, error.status);
    //   }
    // );
    // modalRef.result.then(
    //   (data) => {
    //     this.getPrograms();
    //   },
    //   (reason) => {}
    // );
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
  // changeStatus(id: any) {
    // this.apiService.getOneChildProgramsEdit(this.child.id, id).subscribe(
    //   (res) => {
    //     console.log(res);
    //     localStorage.setItem("oneChildProgram", JSON.stringify(res));
    //     this.cdr.detectChanges();
    //     this.router.navigateByUrl("/apps/childrens/change-status");
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.toastr.error(error.error.message, error.status);
    //   }
    // );
  // }
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
  // deleteChildrens(id: any) {
    // this.apiService.deleteChildrenProgram(this.child.id, id).subscribe(
    //   (res) => {
    //     this.toastr.success(
    //       this.translate.instant("programsDeletedSuccessfully")
    //     );
    //     this.getPrograms();
    //     this.cdr.detectChanges();
    //   },
    //   (error) => {
    //     this.toastr.error(error);
    //     console.log(error);
    //     this.cdr.detectChanges();
    //   }
    // );
  // }
  // openScheduling(id: any) {
  //   const modalRef = this.modalService.open(SchdeuleEvaluationComponent, {
  //     windowClass: "animated fadeInDown",
  //     size: "xl",
  //     centered: true,
  //   });
  //   localStorage.setItem("program_id", id);
  //   modalRef.result.then(
  //     (data) => {
  //       this.getPrograms();
  //     },
  //     (reason) => {}
  //   );
  // }
  // openEvaluation(id: any) {
  //   this.router.navigateByUrl("/apps/childrens/evaluation");
  //   localStorage.setItem("program_id", id);
   
  // }
  openModal(template: TemplateRef<void>, id: any) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }
  decline(): void {
    this.modalRef?.hide();
  }
}
