import { Component } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "mi-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  primaryButtonName!: string;
  currentRoute!: string;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.checkRoute();
  }

  onHeaderButtonClicked() {
    this.router.navigate([
      this.currentRoute.includes("/video-actions") ? "/" : "/video-actions",
    ]);
  }

  checkRoute() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentRoute.includes("/video-actions")) {
          this.primaryButtonName = "Back Home";
        } else {
          this.primaryButtonName = "Add Video";
        }
      }
    });
  }
}
