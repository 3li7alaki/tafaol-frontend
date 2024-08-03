import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-schdeule-evaluation",
  templateUrl: "./schdeule-evaluation.component.html",
  styleUrl: "./schdeule-evaluation.component.scss",
})
export class SchdeuleEvaluationComponent implements OnInit {
  programsForm: FormGroup;
  loading = false;
  programID: any;
  program: any;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private datePipe: DatePipe
  ) {
    this.program = JSON.parse(localStorage.getItem("program")!);
    this.programID = this.program.id;
  }
  ngOnInit(): void {
    if (this.program.evaluation_schedule) {
      this.programsForm = this.formBuilder.group({
        notify: [false],
        schedule: this.formBuilder.array([
            this.newItem(this.program.evaluation_schedule[0]),
            this.newItem(this.program.evaluation_schedule[1]),
            this.newItem(this.program.evaluation_schedule[2]),
        ]),
      });
    } else {
        this.programsForm = this.formBuilder.group({
            notify: [false],
            schedule: this.formBuilder.array([
            this.newItem(),
            this.newItem(),
            this.newItem(),
            ]),
        });
    }
  }

  get f() {
    return this.programsForm.controls;
  }

  addLevel(schedule?: any) {
    this.items().push(this.newItem(schedule));
  }

  newItem(schedule?: any): FormGroup {
    return this.formBuilder.group({
      date: [
        this.datePipe.transform(schedule?.date, "yyyy-MM-dd"),
        Validators.required,
      ],
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
  addGaurd() {
    this.loading = true;
    // if (this.f.schedule instanceof FormArray) {
    //   const scheduleControls = (this.f.schedule as FormArray).controls;
    // }
    const scheduleControls = (this.f.schedule as FormArray).controls;
    const formData = new FormData();
    for (let i = 0; i < scheduleControls.length; i++) {
      formData.append(
        `schedule[${i}][date]`,
        this.datePipe.transform(
          scheduleControls[i].get("date")?.value,
          "yyyy-MM-dd"
        )!
      ); // Add description as needed
      formData.append(
        `schedule[${i}][from]`,
        scheduleControls[i].get("from")?.value.length != 8 ? scheduleControls[i].get("from")?.value + ":00" : scheduleControls[i].get("from")?.value
      );
      formData.append(
        `schedule[${i}][to]`,
        scheduleControls[i].get("to")?.value.length != 8 ? scheduleControls[i].get("to")?.value + ":00" : scheduleControls[i].get("to")?.value
      );
    }
    formData.append("notify", this.f.notify.value == true ? "1" : "0");
    const body = {
      notify: this.f.notify.value,
      schedule: this.f.schedule.value,
    };
    console.log(body);
    this.apiService.addChildProgramShcedule(formData, this.programID).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("shcedulingDone"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message);
        this.loading = false;
        console.log(error.message);
        this.cdr.detectChanges();
      }
    );
  }
}
