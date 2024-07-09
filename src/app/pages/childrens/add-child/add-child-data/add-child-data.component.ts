import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-child-data",
  templateUrl: "./add-child-data.component.html",
  styleUrl: "./add-child-data.component.scss",
})
export class AddChildDataComponent {
  children: any;
  childrenForm: FormGroup;
  nationalityList: any[];
  loading = false;
  selectedFileMother: File;
  imageUrlMother: string;
  selectedFileNationalID: File;
  imageUrlNationalID: string;

  myFiles: any[] = [];
  sMsg: string = "";
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.children = JSON.parse(localStorage.getItem("children")!);
  }
  ngOnInit(): void {
    this.initForm();
    this.apiService.getNationalites().subscribe(
      (res) => {
        console.log(res);
        this.nationalityList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    );
  }
  initForm() {
    this.childrenForm = this.formBuilder.group({
      father_name: [""],
      father_job: [""],
      father_nationality_id: [null],
      father_phone: [""],
      father_work_phone: [""],
      mother_name: [""],
      mother_job: [""],
      mother_nationality_id: [null],
      mother_phone: [""],
      mother_work_phone: [""],
      house_phone: [""],
      close_person_phone: [""],
      siblings_count: [""],
      sibling_order: [""],
      father_age_at_birth: [""],
      mother_age_at_birth: [""],
      parent_relation: [""],
      pregnancy_issue: [""],
      birth_issue: [""],
      familial_issue: [""],
      heart_check: [false],
      heart_check_date: [""],
      heart_check_result: [""],
      thyroid_check: [false],
      thyroid_check_date: [""],
      thyroid_check_result: [""],
      sight_check: [false],
      sight_check_date: [""],
      sight_check_result: [""],
      hearing_check: [false],
      hearing_check_date: [""],
      hearing_check_result: [""],
      epileptic: [""],
      breathing_issues: [""],
      teeth_issues: [""],
      surgeries_done: [""],
      exams_applied: [""],
      problems_faced: [""],
      training_needed: [""],
      other: [""],
    });
  }
  get f() {
    return this.childrenForm.controls;
  }
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlNationalID = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  onFileSelectedNationalMother(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileMother = file;
    // Create a FileReader object to read the file contents
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlMother = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  getFileDetails(e: any) {
    console.log(e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles);
  }
  editChild() {
    const formData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      const file = this.myFiles[i];
      if (file.path) {
      } else {
        formData.append(`attachments[${i}][name]`, file.name);
        formData.append(`attachments[${i}][path]`, file);
      }
    }

    // Log the FormData object to the console
    formData.append("father_name", this.f.father_name.value);
    formData.append("father_job", this.f.father_job.value);
    formData.append(
      "father_nationality_id",
      this.f.father_nationality_id.value
    );
    formData.append("father_phone", "00973" + this.f.father_phone.value);
    formData.append("father_phone", this.f.father_phone.value);
    formData.append("father_work_phone", this.f.father_work_phone.value);
    formData.append("mother_name", this.f.mother_name.value);
    formData.append("mother_job", this.f.mother_job.value);
    formData.append(
      "mother_nationality_id",
      this.f.mother_nationality_id.value
    );
    formData.append("mother_phone", "00973" + this.f.mother_phone.value);
    formData.append("mother_work_phone", this.f.mother_work_phone.value);
    formData.append("house_phone", this.f.house_phone.value);
    formData.append("close_person_phone", this.f.close_person_phone.value);
    formData.append("siblings_count", this.f.siblings_count.value);
    formData.append("sibling_order", this.f.sibling_order.value);
    formData.append("father_age_at_birth", this.f.father_age_at_birth.value);
    formData.append("mother_age_at_birth", this.f.mother_age_at_birth.value);
    formData.append("parent_relation", this.f.parent_relation.value);
    formData.append("pregnancy_issue", this.f.pregnancy_issue.value);
    formData.append("birth_issue", this.f.birth_issue.value);
    formData.append("familial_issue", this.f.familial_issue.value);
    formData.append(
      "heart_check",
      this.f.heart_check.value === true ? "1" : "0"
    );
    formData.append(
      "heart_check_date",
      this.datePipe.transform(this.f.heart_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("heart_check_result", this.f.heart_check_result.value);
    formData.append(
      "thyroid_check",
      this.f.thyroid_check.value === true ? "1" : "0"
    );
    formData.append(
      "thyroid_check_date",
      this.datePipe.transform(this.f.thyroid_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("thyroid_check_result", this.f.thyroid_check_result.value);
    formData.append(
      "sight_check",
      this.f.sight_check.value === true ? "1" : "0"
    );
    formData.append(
      "sight_check_date",
      this.datePipe.transform(this.f.sight_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("sight_check_result", this.f.sight_check_result.value);
    formData.append(
      "hearing_check",
      this.f.hearing_check.value === true ? "1" : "0"
    );
    formData.append(
      "hearing_check_date",
      this.datePipe.transform(this.f.hearing_check_date.value, "yyyy-MM-dd")!
    );
    formData.append("hearing_check_result", this.f.hearing_check_result.value);
    formData.append(
      "mother_national_id",
      (this.selectedFileMother == null ? null : this.selectedFileMother)!
    );

    formData.append(
      "father_national_id",
      (this.selectedFileNationalID == null
        ? null
        : this.selectedFileNationalID)!
    );

    formData.append("epileptic", this.f.epileptic.value);
    formData.append("breathing_issues", this.f.breathing_issues.value);
    formData.append("teeth_issues", this.f.teeth_issues.value);

    formData.append("surgeries_done", this.f.surgeries_done.value);
    formData.append("exams_applied", this.f.exams_applied.value);
    formData.append("problems_faced", this.f.problems_faced.value);
    formData.append("training_needed", this.f.training_needed.value);
    formData.append("other", this.f.other.value);

    this.loading = true;
    console.log(formData);
    this.apiService.addChildrenData(formData, this.children.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("childAddedSuccessfully"));
        this.router.navigate(["/apps/childrens"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
}
