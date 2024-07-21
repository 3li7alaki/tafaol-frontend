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
  filtered: any;
  fromDate: any;
    toDate: any;

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
        this.filtered = data;
        this.fromDate = null;
        this.toDate = null;
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

  search(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value
    if (input) {
      this.filtered = this.filtered.filter((item: any) => {
        return (
            item.full_name.toLowerCase().includes(input.toLowerCase()) ||
            (item.cpr?.toLowerCase().includes(input.toLowerCase()) && input.length > 4) ||
            item.child_programs.id.toString().includes(input.toLowerCase())
        );
      });
    } else {
      this.filtered = this.history;
    }
  }

  dateFrom(date: any) {
    if (date) {
      this.filtered = this.history.filter((item: any) => {
        let created_at = new Date(item.child_programs.created_at).setHours(0,0,0,0);
        let input = new Date(date).setHours(0, 0, 0, 0)
        this.fromDate = new Date(input)
        let before = this.toDate ? new Date(created_at) <= this.toDate : true;
        return (
            new Date(created_at) >= new Date(input) && before
        );
      });
    } else {
      this.filtered = this.history;
      this.fromDate = null;
    }
  }

  dateTo(date: any) {
    if (date) {
      this.filtered = this.history.filter((item: any) => {
        let created_at = new Date(item.child_programs.created_at).setHours(0,0,0,0);
        let input = new Date(date).setHours(0, 0, 0, 0);
        this.toDate = new Date(input);
        let after =this.fromDate ? new Date(created_at) >= this.fromDate : true;
        return (
            new Date(created_at) <= new Date(input) && after
        );
      });
    } else {
      this.filtered = this.history;
        this.toDate = null;
    }
  }
}
