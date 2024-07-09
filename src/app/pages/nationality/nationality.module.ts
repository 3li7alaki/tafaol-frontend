import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NationalityListComponent } from "./nationality-list/nationality-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { RouterModule } from "@angular/router";
import { AddNationalityComponent } from "./add-nationality/add-nationality.component";
import { WidgetsModule, ModalsModule } from "src/app/_metronic/partials";
import { EditNationalityComponent } from "./edit-nationality/edit-nationality.component";
import { NationalityResolver } from "./nationality.resolver";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [NationalityListComponent, AddNationalityComponent, EditNationalityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: NationalityListComponent,
      },
      {
        path: "add-nationality",
        component: AddNationalityComponent,
      },
      {
        path: "edit-nationality/:id",
        component: EditNationalityComponent,
        resolve: { nationality: NationalityResolver },
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
    WidgetsModule,
    ModalsModule,
    ModalModule.forRoot(),
  ],
})
export class NationalityModule {}
