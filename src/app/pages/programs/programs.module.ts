import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { InlineSVGModule } from "ng-inline-svg-2";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ToastrModule } from "ngx-toastr";
import { WidgetsModule, ModalsModule } from "src/app/_metronic/partials";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { ProgramListComponent } from "./program-list/program-list.component";
import { AddProgramComponent } from "./add-program/add-program.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { EditProgramComponent } from "./edit-program/edit-program.component";
import { ProgramResolver } from "./program.resolver";
import { ReportComponent } from "./report/report.component";

@NgModule({
  declarations: [
    ProgramListComponent,
    AddProgramComponent,
    EditProgramComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProgramListComponent,
      },
      {
        path: "add-program",
        component: AddProgramComponent,
      },
      {
        path: "edit-program/:id",
        component: EditProgramComponent,
        resolve: {
          program: ProgramResolver,
        },
      },
    ]),
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    TranslateModule,
    WidgetsModule,
    MatButtonToggleModule,
    ModalsModule,
    InlineSVGModule,
    ToastrModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  providers: [DatePipe],
})
export class ProgramsModule {}
