import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-diagnoses-list",
  templateUrl: "./diagnoses-list.component.html",
  styleUrl: "./diagnoses-list.component.scss",
})
export class DiagnosesListComponent implements OnInit {
  diagnosesList: any[];
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
   
  ) {}
  ngOnInit(): void {
    this.getDiagnoses();
  }

  getDiagnoses() {
    this.apiService.getDiagnoses().subscribe(
      (res) => {

        this.diagnosesList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  };
 
}
