import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import { Location } from "@angular/common";
import { AddEvaluationComponent } from "../add-evaluation/add-evaluation.component";

@Component({
  selector: "app-evaluation-list",
  templateUrl: "./evaluation-list.component.html",
  styleUrl: "./evaluation-list.component.scss",
})
export class EvaluationListComponent implements OnInit {
  child: any;
  program: any;
  loading = false;
  statusList: any;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private location: Location
  ) {
    this.program = JSON.parse(localStorage.getItem("program_id")!);
    this.getChangeStatus();
  }
  ngOnInit(): void {}

  getChangeStatus() {
    this.apiService.getChildProgramEvaluation(this.program).subscribe(
      (res) => {

        localStorage.setItem("evaluationProgram", JSON.stringify(res));
        this.statusList = res;
        this.cdr.detectChanges();
      },
      (error) => {

      }
    );
  }
  open() {
    const modalRef = this.modalService.open(AddEvaluationComponent, {
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
}
