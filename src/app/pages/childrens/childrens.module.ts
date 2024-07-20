import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ChildrensListComponent } from "./childrens-list/childrens-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NgbNavModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbModalModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { InlineSVGModule } from "ng-inline-svg-2";
import { ToastrModule } from "ngx-toastr";
import { WidgetsModule, ModalsModule } from "src/app/_metronic/partials";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { CrudModule } from "src/app/modules/crud/crud.module";
import { AddChildComponent } from "./add-child/add-child.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ChildrensResolver } from "./childrens.resolver";
import { EditChildComponent } from "./edit-child/edit-child.component";
import { ChildDataComponent } from "./edit-child/child-data/child-data.component";
import { BasicChildDataComponent } from "./edit-child/basic-child-data/basic-child-data.component";
import { AddBasicChildDataComponent } from "./add-child/add-basic-child-data/add-basic-child-data.component";
import { ChildDiagnoseComponent } from "./edit-child/child-diagnose/child-diagnose.component";
import { AddDiagnoseComponent } from "./edit-child/child-diagnose/add-diagnose/add-diagnose.component";
import { EditDiagnoseComponent } from "./edit-child/child-diagnose/edit-diagnose/edit-diagnose.component";
import { ChildProgramsComponent } from "./edit-child/child-programs/child-programs.component";
import { AddProgramsComponent } from "./edit-child/child-programs/add-programs/add-programs.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { EditProgramsComponent } from "./edit-child/child-programs/edit-programs/edit-programs.component";
import { ChangeStatusComponent } from "./edit-child/child-programs/change-status/change-status.component";
import { AddStatusComponent } from "./edit-child/child-programs/change-status/add-status/add-status.component";
import { EditStatusComponent } from "./edit-child/child-programs/change-status/edit-status/edit-status.component";
import { SchdeuleEvaluationComponent } from "./edit-child/schdeule-evaluation/schdeule-evaluation.component";
import { EvaluationListComponent } from "./edit-child/evaluation/evaluation-list/evaluation-list.component";
import { AddEvaluationComponent } from "./edit-child/evaluation/add-evaluation/add-evaluation.component";
import { EditEvaluationComponent } from "./edit-child/evaluation/edit-evaluation/edit-evaluation.component";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChildAttachmentsComponent } from "./edit-child/child-attachments/child-attachments.component";
import { AddAttachmentsComponent } from "./edit-child/child-attachments/add-attachments/add-attachments.component";
import { EditAttachmentsComponent } from "./edit-child/child-attachments/edit-attachments/edit-attachments.component";
// ...

defineLocale('ar', arLocale);
@NgModule({
  declarations: [
    ChildrensListComponent,
    AddChildComponent,
    EditChildComponent,
    ChildDataComponent,
    BasicChildDataComponent,
    AddBasicChildDataComponent,
    ChildDiagnoseComponent,
    AddDiagnoseComponent,
    EditDiagnoseComponent,
    ChildProgramsComponent,
    AddProgramsComponent,
    EditProgramsComponent,
    ChangeStatusComponent,
    AddStatusComponent,
    EditStatusComponent,
    SchdeuleEvaluationComponent,
    EvaluationListComponent,
    AddEvaluationComponent,
    EditEvaluationComponent,
    ChildAttachmentsComponent,
    AddAttachmentsComponent,
    EditAttachmentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: ChildrensListComponent,
      },
      {
        path: "add-child",
        component: AddChildComponent,
        children: [
          {
            path: "add-basic-data",
            component: AddBasicChildDataComponent,
          },
        ],
      },
      {
        path: "edit-child/:id",
        component: EditChildComponent,
        resolve: {
          child: ChildrensResolver,
        },
        children: [
          {
            path: "basic-data",
            component: BasicChildDataComponent,
          },
          {
            path: "data",
            component: ChildDataComponent,
          },
          {
            path: "diagnoses",
            component: ChildDiagnoseComponent,
          },
          {
            path: "programs",
            component: ChildProgramsComponent,
          },
          {
            path: "attachments",
            component: ChildAttachmentsComponent,
          }
        ],
      },
      {
        path: "change-status",
        component: ChangeStatusComponent,
      },
      {
        path: "evaluation",
        component: EvaluationListComponent,
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
    MatButtonToggleModule,
    ToastrModule,
    NgbModalModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [DatePipe],
})
export class ChildrensModule {
  constructor(private localeService: BsLocaleService) {
    this.localeService.use('ar');
  }
}
