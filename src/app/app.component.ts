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
import { locale as arLang } from "./modules/i18n/vocabs/ar";
import { ThemeModeService } from "./_metronic/partials/layout/theme-mode-switcher/theme-mode.service";
import { DOCUMENT } from "@angular/common";
import { DirectionService } from "./services/direction.service";
import { TokenValidationService } from "./services/auth/token-validation.service";
import { Router } from "@angular/router";

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
    @Inject(DOCUMENT) private document: Document,
    private dirService: DirectionService,
    public translate: TranslateService,
    private tokenValidationService: TokenValidationService,
    private router: Router
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
    
    // Validate token on app initialization
    this.validateUserToken();
  }
  
  /**
   * Validates the user's authentication token when the app starts
   * Redirects to login page if token is invalid or missing
   */
  private validateUserToken(): void {
    // Skip validation if we're already on the auth pages
    if (window.location.href.includes('/auth/')) {
      return;
    }
    
    this.tokenValidationService.validateToken().subscribe(isValid => {
      if (!isValid) {
        // Token is invalid, redirect to login page
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
