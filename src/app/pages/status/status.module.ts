import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusListComponent } from './status-list/status-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule, ModalsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { AddStatusComponent } from './add-status/add-status.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { StatusResolver } from './status.resolver';



@NgModule({
  declarations: [StatusListComponent, AddStatusComponent, EditStatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "",
        component: StatusListComponent,
      },
      {
        path : 'add-status', 
        component : AddStatusComponent
      },
      {
        path: 'edit-status/:id',
        component : EditStatusComponent,
        resolve : {
          status : StatusResolver
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
  ]
})
export class StatusModule { }
