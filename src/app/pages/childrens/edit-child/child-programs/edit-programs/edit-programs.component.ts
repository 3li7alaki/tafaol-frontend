import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-programs",
  templateUrl: "./edit-programs.component.html",
  styleUrl: "./edit-programs.component.scss",
})
export class EditProgramsComponent implements OnInit {
  programsForm: FormGroup;
  loading = false;
  statusList: any;
  programsList: any;
  child: any;
  program: any;
  days: any[] = [
    {
      name_ar: "السبت",
      name: "Saturday",
    },
    {
      name_ar: "الأحد",
      name: "Sunday",
    },
    {
      name_ar: "الإثنين",
      name: "Monday",
    },
    {
      name_ar: "الثلاثاء",
      name: "Tuesday",
    },
    {
      name_ar: "الأربعاء",
      name: "Wednesday",
    },
    {
      name_ar: "الخميس",
      name: "Thursday",
    },
    {
      name_ar: "الجمعة",
      name: "Friday",
    },
  ];
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
    this.child = JSON.parse(localStorage.getItem("children")!);
    this.program = JSON.parse(localStorage.getItem("oneChildProgram")!);
    
   
  }
  ngOnInit(): void {
    this.getPrograms();
    this.getStatus();
    this.initForm();
    this.program.schedule.forEach((element: any) => {
      this.addLevel(element);
    });
  }

  initForm() {
    this.programsForm = this.formBuilder.group({
      program_id: [this.program.program_id, [Validators.required]],
      status_id: [this.program.status_id, [Validators.required]],
      date: [""],
      note: [""],
      schedule: this.formBuilder.array([]),
      applyDate: [this.program.created_at],
      age: [this.program.age],
    });
    this.f.age.disable();
  }
  get f() {
    return this.programsForm.controls;
  }
  addLevel(schedule?: any) {
    this.items().push(this.newItem(schedule));
  }

  newItem(schedule?: any): FormGroup {
    return this.formBuilder.group({
      day: [schedule?.day, Validators.required],
      from: [schedule?.from, Validators.required],
      to: [schedule?.to, Validators.required],
    });
  }

  items(): FormArray {
    return this.programsForm.get("schedule") as FormArray;
  }
  removeLevel(i: number) {
    this.items().removeAt(i);
  }
  getStatus() {
    this.apiService.getStatus().subscribe(
      (res) => {

        this.statusList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  getPrograms() {
    this.apiService.getPrograms().subscribe(
      (res) => {

        this.programsList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  addGaurd() {
    this.loading = true;
    if (this.f.schedule instanceof FormArray) {
      const scheduleControls = (this.f.schedule as FormArray).controls;

      for (let i = 0; i < scheduleControls.length; i++) {
        const startTime = scheduleControls[i].get("from")?.value;
        const endTime = scheduleControls[i].get("to")?.value;

        if (startTime !== null && endTime !== null) {
          scheduleControls[i].get("from")?.setValue(startTime + ":00");
          scheduleControls[i].get("to")?.setValue(endTime + ":00");
        }
      }
    }
    
    const body = {
      program_id: this.f.program_id.value,
      status_id: this.f.status_id.value,
      date: this.datePipe.transform(this.f.date.value, "yyyy-MM-dd")!,
      note: this.f.note.value,
      schedule: this.f.schedule.value,
      active : true,
      created_at: this.datePipe.transform(this.f.applyDate.value, "yyyy-MM-dd")!,
    };

    this.apiService.editChildProgram(body, this.child.id, this.program.id).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(this.translate.instant("programsEditedSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        
        this.cdr.detectChanges();
      }
    );
  }
}
