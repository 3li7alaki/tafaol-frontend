import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DiagnosesListComponent } from "./diagnoses-list/diagnoses-list.component";
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
import { AddDiagnosesComponent } from "./add-diagnoses/add-diagnoses.component";
import { EditDiagnosesComponent } from "./edit-diagnoses/edit-diagnoses.component";
import { DiagnosesResolver } from "./diagnoses.resolver";

@NgModule({
  declarations: [DiagnosesListComponent, AddDiagnosesComponent, EditDiagnosesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: DiagnosesListComponent,
      },
      {
        path: "add-diagnoses",
        component: AddDiagnosesComponent,
      },
      {
        path : 'edit-diagnoses/:id',
        component : EditDiagnosesComponent,
        resolve : {
          diagnoses : DiagnosesResolver
        }
      }
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
export class DiagnoseModule {}
