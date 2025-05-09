import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ThemeModeSwitcherComponent } from './theme-mode-switcher.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ThemeModeSwitcherComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    SharedModule,
    TranslateModule
  ],
  exports: [ThemeModeSwitcherComponent]
})
export class ThemeModeModule {}
