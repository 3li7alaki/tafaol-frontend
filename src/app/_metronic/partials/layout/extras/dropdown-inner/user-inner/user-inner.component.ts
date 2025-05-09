import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { TranslationService } from "../../../../../../modules/i18n";
import { AuthService, UserType } from "../../../../../../modules/auth";

@Component({
  selector: "app-user-inner",
  templateUrl: "./user-inner.component.html",
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding("attr.data-kt-menu") dataKtMenu = "true";

  language: LanguageFlag;
  user$: any;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private translationService: TranslationService
  ) {
    const user = localStorage.getItem("user");
    this.user$ = JSON.parse(user!);
  }

  ngOnInit(): void {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: "en",
    name: "English",
    flag: "./assets/media/flags/united-states.svg",
  },
  {
    lang: "ar",
    name: "العربية",
    flag: "./assets/media/flags/bahrain.svg",
  },
];
