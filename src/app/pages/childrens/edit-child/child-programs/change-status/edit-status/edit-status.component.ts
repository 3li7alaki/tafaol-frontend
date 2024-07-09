import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-status",
  templateUrl: "./edit-status.component.html",
  styleUrl: "./edit-status.component.scss",
})
export class EditStatusComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  statusList: any;
  status: any;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.status = JSON.parse(localStorage.getItem("oneChildStatus")!);
  }
  ngOnInit(): void {
    this.getStatus();
    this.initForm();
    console.log(this.status);
  }

  initForm() {
    this.statusForm = this.formBuilder.group({
      old_status_id: [this.status?.old_status?.id, [Validators.required]],
      new_status_id: [this.status?.new_status?.id, [Validators.required]],
      date: [this.status?.date],
      note: [this.status?.note],
    });
  }
  get f() {
    return this.statusForm.controls;
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

  addGaurd() {
    this.loading = true;
    const body = {
      old_status_id: this.f.old_status_id.value,
      new_status_id: this.f.new_status_id.value,
      date: this.datePipe.transform(this.f.date.value, "yyyy-MM-dd"),
      note: this.f.note.value,
    };
    console.log(body);
    this.apiService
      .ChildStatusEdit(this.status.id, this.status.child_program_id, body)
      .subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
          this.toastr.success(
            this.translate.instant("statusEditedSuccessfully")
          );
          this.activeModal.close();
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.error);
          this.loading = false;
          console.log(error.message);
          this.cdr.detectChanges();
        }
      );
  }
}
