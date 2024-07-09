import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { TranslationService } from "./modules/i18n";
import { TranslateService } from "@ngx-translate/core";
// language list
import { locale as enLang } from "./modules/i18n/vocabs/en";
import { locale as chLang } from "./modules/i18n/vocabs/ch";
import { locale as esLang } from "./modules/i18n/vocabs/es";
import { locale as jpLang } from "./modules/i18n/vocabs/jp";
import { locale as deLang } from "./modules/i18n/vocabs/de";
import { locale as frLang } from "./modules/i18n/vocabs/fr";
import { locale as arLang } from "./modules/i18n/vocabs/ar";
import { ThemeModeService } from "./_metronic/partials/layout/theme-mode-switcher/theme-mode.service";
import { DOCUMENT } from "@angular/common";
import { DirectionService } from "./services/direction.service";

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "body[root]",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  direction: "rtl.css" | "ltr.css";
  currentLang: any;
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private dirService: DirectionService,
    public translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe(() => {
      const lang = this.translate.currentLang;
      const wrapperStyleUrl =
        lang === "en"
          ? "./assets/sass/core/layout/base/_wrapper.scss"
          : "./assets/sass/core/layout/base/_wrapper.rtl.scss";
      const mainStyleUrl =
        lang === "en"
          ? "./assets/sass/style.scss"
          : "./assets/css/style.rtl.css";

      this.updateStyleImport(wrapperStyleUrl, mainStyleUrl);
    });
    translate.onLangChange.subscribe((x) => {
      const lang = localStorage.getItem("language");
      if (lang === "ar") {
        dirService.switchDirection(true);
        //  this.datePickerLocale.setLocaleAR();
      } else {
        dirService.switchDirection(false);
        // this.datePickerLocale.setLocaleEN();
      }
    });
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang,
      arLang
    );
  }
  private updateStyleImport(wrapperStyleUrl: string, mainStyleUrl: string) {
    const head = document.getElementsByTagName("head")[0];
    const existingWrapperLink = document.getElementById("dynamicWrapperStyle");
    const existingMainLink = document.getElementById("dynamicMainStyle");

    if (existingWrapperLink) {
      head.removeChild(existingWrapperLink);
    }

    if (existingMainLink) {
      head.removeChild(existingMainLink);
    }

    const wrapperLink = document.createElement("link");
    wrapperLink.id = "dynamicWrapperStyle";
    wrapperLink.rel = "stylesheet";
    wrapperLink.href = wrapperStyleUrl;

    const mainLink = document.createElement("link");
    mainLink.id = "dynamicMainStyle";
    mainLink.rel = "stylesheet";
    mainLink.href = mainStyleUrl;

    head.appendChild(wrapperLink);
    head.appendChild(mainLink);
  }
  ngOnInit() {
    this.modeService.init();
    // localStorage.setItem('language', 'ar')
  }
}
