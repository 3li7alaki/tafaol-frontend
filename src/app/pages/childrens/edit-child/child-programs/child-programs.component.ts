import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import { AddProgramsComponent } from "./add-programs/add-programs.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditProgramsComponent } from "./edit-programs/edit-programs.component";
import { Router } from "@angular/router";
import { SchdeuleEvaluationComponent } from "../schdeule-evaluation/schdeule-evaluation.component";
import { EvaluationListComponent } from "../evaluation/evaluation-list/evaluation-list.component";

@Component({
  selector: "app-child-programs",
  templateUrl: "./child-programs.component.html",
  styleUrl: "./child-programs.component.scss",
})
export class ChildProgramsComponent implements OnInit {
  programList: any[];
  child: any;
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.child = JSON.parse(localStorage.getItem("children")!);
  }
  ngOnInit(): void {
    this.getPrograms();
  }
  getPrograms() {
    this.apiService.getOneChildProgram(this.child.id).subscribe(
      (res) => {

        this.programList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  open() {
    const modalRef = this.modalService.open(AddProgramsComponent, {
      windowClass: "animated fadeInDown",
      size: "xl",
      centered: true,
    });

    modalRef.result.then(
      (data) => {
        this.getPrograms();
      },
      (reason) => {}
    );
  }
  openEdit(id: any) {
    this.apiService.getOneChildProgramsEdit(this.child.id, id).subscribe(
      (res) => {

        localStorage.setItem("oneChildProgram", JSON.stringify(res));
        this.cdr.detectChanges();

        const modalRef = this.modalService.open(EditProgramsComponent, {
          windowClass: "animated fadeInDown",
          size: "xl",
          centered: true,
        });

        modalRef.result.then(
            (data) => {
              this.getPrograms();
            },
            (reason) => {}
        );
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  changeStatus(id: any) {
    this.apiService.getOneChildProgramsEdit(this.child.id, id).subscribe(
      (res) => {

        localStorage.setItem("oneChildProgram", JSON.stringify(res));
        this.cdr.detectChanges();
        this.router.navigateByUrl("/apps/childrens/change-status");
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  deleteChildrens(id: any) {
    this.apiService.deleteChildrenProgram(this.child.id, id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("programsDeletedSuccessfully")
        );
        this.getPrograms();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);

        this.cdr.detectChanges();
      }
    );
  }
  openScheduling(program: any) {
    localStorage.setItem("program", JSON.stringify(program));
    const modalRef = this.modalService.open(SchdeuleEvaluationComponent, {
      windowClass: "animated fadeInDown",
      size: "xl",
      centered: true,
    });
    modalRef.result.then(
      (data) => {
        this.getPrograms();
      },
      (reason) => {}
    );
  }
  openEvaluation(id: any) {
    this.router.navigateByUrl("/apps/childrens/evaluation");
    localStorage.setItem("program_id", id);
   
  }
}
