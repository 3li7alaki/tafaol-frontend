import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import { AddStatusComponent } from "./add-status/add-status.component";
import { EditStatusComponent } from "./edit-status/edit-status.component";
import { Location } from '@angular/common'
@Component({
  selector: "app-change-status",
  templateUrl: "./change-status.component.html",
  styleUrl: "./change-status.component.scss",
})
export class ChangeStatusComponent implements OnInit {
  child: any;
  program: any;
  loading = false;
  statusList: any;
  programForm: FormGroup;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private location : Location
  ) {
    this.child = JSON.parse(localStorage.getItem("children")!);
    this.program = JSON.parse(localStorage.getItem("oneChildProgram")!);
  }
  ngOnInit(): void {
    this.getChangeStatus();
    this.initForm();
  }
  get f() {
    return this.programForm.controls;
  }
  initForm() {
    this.programForm = this.formBuilder.group({
      program_id: [this.program.program?.name],
      status_id: [
        this.translate.defaultLang == "en"
          ? this.program.status?.name
          : this.program.status?.name_ar,
      ],
    });
    this.f.program_id.disable();
    this.f.status_id.disable();
  }

  getChangeStatus() {
    this.apiService.getChildStatus(this.child.id, this.program.id).subscribe(
      (res) => {

        this.statusList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  open() {
    const modalRef = this.modalService.open(AddStatusComponent, {
      windowClass: "animated fadeInDown",
      size: "xl",
      centered: true,
    });

    modalRef.result.then(
      (data) => {
        this.getChangeStatus();
      },
      (reason) => {}
    );
  }
  openEdit(id: any, programID : any) {
    
    this.apiService.getOneChildStatusEdit(id,programID).subscribe(
      (res) => {

        localStorage.setItem("oneChildStatus", JSON.stringify(res));
        const modalRef = this.modalService.open(EditStatusComponent, {
          windowClass: "animated fadeInDown",
          size: "xl",
          centered: true,
        });
        modalRef.result.then(
          (data) => {
            this.getChangeStatus();
          },
          (reason) => {}
        );
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
   
  };
  deleteStatus(id: any, changeId : any) {
    this.apiService.deleteChildStatus(id, changeId).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("statusDeletedSuccessfully")
        );
        this.getChangeStatus();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

        this.cdr.detectChanges();
      }
    );
  };
  goBackToPrevPage(): void {
    this.location.back();
  }
}
