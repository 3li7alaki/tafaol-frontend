import { DOCUMENT } from "@angular/common";
import { Inject, Renderer2, RendererFactory2 } from "@angular/core";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DirectionService {
  private data = new BehaviorSubject("");
  currentData = this.data.asObservable();

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public updateDirection(item: any) {
    this.data.next(item);
  }

  public getDirection(): "rtl" | "ltr" {
    if (localStorage.getItem("language") === "ar") {
      return "rtl";
    } else {
      return "ltr";
    }
  }

  public switchDirection(isrtl: boolean) {
    if (isrtl) {
      this.document.documentElement.setAttribute("dir", "rtl");
      this.renderer.removeClass(this.document.body, "dir-ltr");
      this.renderer.addClass(this.document.body, "dir-rtl");
    } else {
      this.document.documentElement.setAttribute("dir", "ltr");
      this.renderer.removeClass(this.document.body, "dir-rtl");
      this.renderer.addClass(this.document.body, "dir-ltr");
    }
  }
}
