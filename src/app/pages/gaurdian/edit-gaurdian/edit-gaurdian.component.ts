import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-gaurdian',
  templateUrl: './edit-gaurdian.component.html',
  styleUrl: './edit-gaurdian.component.scss'
})
export class EditGaurdianComponent implements OnInit {
  id : any;
  gaurdian : any;
  gaurdianForm: FormGroup;
  loading = false;
  eye = false;
  constructor(
    private rout: ActivatedRoute,  
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router,
  ){
    this.id = this.rout.snapshot.params["id"];
    this.gaurdian = this.rout.snapshot.data.gaurdian;
  }
  ngOnInit(): void {
    this.initForm();
  };
  initForm() {
    this.gaurdianForm = this.formBuilder.group({
      name: [this.gaurdian.name, [Validators.required]],
      email: [this.gaurdian.email, [Validators.required, Validators.email]],
      phone: [this.gaurdian.phone, [Validators.required]],
      relation: [this.gaurdian.relation, [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password_confirmation: ["", [Validators.required, Validators.minLength(8)]],
    });
  }
  get f() {
    return this.gaurdianForm.controls;
  };
  togglePassword() {
    this.eye = !this.eye;
  };
  addGaurd() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      email: this.f.email.value,
      phone: this.f.phone.value,
      relation: this.f.relation.value,
      password: this.f.password.value,
      password_confirmation: this.f.password_confirmation.value,
    };

    this.apiService.editGaurdian(body, this.id).subscribe(
      (res) => {
        this.loading = false

        this.toastr.success(this.translate.instant('gaurdianAddedSuccessfully'));
        this.router.navigate(['/apps/gaurdian'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error)
        this.loading = false
        this.cdr.detectChanges()
      }
    );
  };
}
