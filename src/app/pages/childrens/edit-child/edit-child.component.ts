import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-child",
  templateUrl: "./edit-child.component.html",
  styleUrl: "./edit-child.component.scss",
})
export class EditChildComponent implements OnInit {
  id: any;
  children: any;
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showDiagnoses = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private rout: ActivatedRoute,
    public translate: TranslateService,
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.children = this.rout.snapshot.data.child;
    localStorage.setItem("children", JSON.stringify(this.children));

    if (this.user.type != "super_admin") {
      this.showDiagnoses =
        this.permissionList?.includes("view-children-diagnoses");
    } else {
      this.showDiagnoses = true;
    }
  }
  ngOnInit(): void {}
}
