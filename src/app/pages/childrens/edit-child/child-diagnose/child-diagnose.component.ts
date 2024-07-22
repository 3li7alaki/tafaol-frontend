import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import { AddDiagnoseComponent } from "./add-diagnose/add-diagnose.component";
import { EditDiagnoseComponent } from "./edit-diagnose/edit-diagnose.component";

@Component({
  selector: "app-child-diagnose",
  templateUrl: "./child-diagnose.component.html",
  styleUrl: "./child-diagnose.component.scss",
})
export class ChildDiagnoseComponent implements OnInit {
  diagnosesList: any[];
  children: any;
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.children = JSON.parse(localStorage.getItem("children")!);
  }
  ngOnInit(): void {
    this.getDiagnoses();
  }

  getDiagnoses() {
    this.apiService.getOneChildDiagnose(this.children.id).subscribe(
      (res) => {
        console.log(res);
        this.diagnosesList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }

  open() {
    const modalRef = this.modalService.open(AddDiagnoseComponent, {
      windowClass: "animated fadeInDown",
      size: "xl",
      centered: true,
    });

    modalRef.result.then(
      (data) => {
        this.getDiagnoses();
      },
      (reason) => {}
    );
  }
  openEdit(id: any) {
    this.apiService.getOneChildDiagnoseEdit(this.children.id, id.diagnose.id).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem("oneChild", JSON.stringify(res));
        this.cdr.detectChanges();
        const modalRef = this.modalService.open(EditDiagnoseComponent, {
          windowClass: "animated fadeInDown",
          size: "xl",
          centered: true,
        });
        modalRef.componentInstance.id = id.diagnose.id;
        modalRef.result.then(
          (data) => {
            localStorage.removeItem("oneChild");
            this.getDiagnoses();
          },
          (reason) => {}
        );
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
}
