import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrl: "./report.component.scss",
})
export class ReportComponent implements OnInit {
  filterForm: FormGroup;
  isVisiable = true;
  isLoading = false;
  programList: any;
  statusList: any;
  history: any;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService,
    public translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.getPrograms();
    this.getStatus();
    this.iniateForm();
  }

  iniateForm() {
    this.filterForm = this.formBuilder.group({
      program_id: [""],
      status_id: [""],
    });
  }
  getPrograms() {
    this.apiService.getPrograms().subscribe(
      (res) => {
        console.log(res);
        this.programList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  getStatus() {
    this.apiService.getStatus().subscribe(
      (res) => {
        console.log(res);
        this.statusList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  getPoints() {
    this.isLoading = true;
    const body = {
      status_id: this.f.status_id.value == "" ? null : this.f.status_id.value,
      program_id: this.f.program_id.value == "" ? null : this.f.program_id.value,
    };
    this.apiService.getProgramReport(body).subscribe(
      (data: any) => {
        this.isLoading = false;

        this.history = data;
        console.log(this.history);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message);
        this.isLoading = false;
      }
    );
  }

  get f() {
    return this.filterForm.controls;
  }
}
