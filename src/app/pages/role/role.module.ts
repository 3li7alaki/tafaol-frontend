import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RoleListingComponent } from "./role-listing/role-listing.component";
import { RoleDetailsComponent } from "./role-details/role-details.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { AddRolesComponent } from "./add-roles/add-roles.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { EditRolesComponent } from "./edit-roles/edit-roles.component";
import { RolesResolver } from "./roles.resolver";
import { TranslateModule } from "@ngx-translate/core";
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    RoleDetailsComponent,
    RoleListingComponent,
    AddRolesComponent,
    EditRolesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: RoleListingComponent,
      },
      {
        path: "add-role",
        component: AddRolesComponent,
      },
      {
        path: "edit-role/:id",
        component: EditRolesComponent,
        resolve:{role : RolesResolver}
      },
    ]),
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    TranslateModule,
    ModalModule.forRoot(),
  ],
})
export class RoleModule {}
