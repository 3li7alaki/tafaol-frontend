import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GaurdianListComponent } from "./gaurdian-list/gaurdian-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { InlineSVGModule } from "ng-inline-svg-2";
import { ToastrModule } from "ngx-toastr";
import { WidgetsModule, ModalsModule } from "src/app/_metronic/partials";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { AddGaurdianComponent } from "./add-gaurdian/add-gaurdian.component";
import { EditGaurdianComponent } from "./edit-gaurdian/edit-gaurdian.component";
import { GaurdianResolver } from "./gaurdian.resolver";

@NgModule({
  declarations: [
    GaurdianListComponent,
    AddGaurdianComponent,
    EditGaurdianComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: GaurdianListComponent,
      },
      {
        path: "add-gaurdian",
        component: AddGaurdianComponent,
      },
      {
        path: "edit-gaurdian/:id",
        component: EditGaurdianComponent,
        resolve: {
          gaurdian: GaurdianResolver,
        },
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
    InlineSVGModule,
    ToastrModule,
  ],
})
export class GaurdianModule {}
