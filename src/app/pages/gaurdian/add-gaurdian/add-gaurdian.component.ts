import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-gaurdian',
  templateUrl: './add-gaurdian.component.html',
  styleUrl: './add-gaurdian.component.scss'
})
export class AddGaurdianComponent implements OnInit {
  gaurdianFrom: FormGroup;
  loading = false;
  eye = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router,
  ){}
  ngOnInit(): void {
    this.initForm();
  };
  initForm() {
    this.gaurdianFrom = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ['973', [Validators.required]],
      relation: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password_confirmation: ["", [Validators.required, Validators.minLength(8)]],
    });
  }
  get f() {
    return this.gaurdianFrom.controls;
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

    this.apiService.addGaurdian(body).subscribe(
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
