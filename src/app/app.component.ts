import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showLoader = false;
  isDesktopScreen: boolean = true;
  service: string;

  constructor(private authenticationService: AuthenticationService, private router: Router,
    private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
    // window.innerWidth <= 1024 && this.authenticationService.role==='admin'? this.isDesktopScreen = false : this.isDesktopScreen = true;
    // this.progressBar.toggle$.subscribe(data => {
    //   this.showLoader = data;
    // });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setDynamicTitle();
      }
    })
  }

  /**
   * Method that sets dynamic title based on current route
   */
  setDynamicTitle() {
    const ar: ActivatedRoute = this.getChild(this.activatedRoute);
    this.service =  ar.snapshot.queryParams.service?.replace(/^(.).*/, '$1');
    // adding service from queryParams for routes of forms[i.e for 2 routes namely 'create-vendor' and 'view-vendor']
    const title = this.service? `[${this.service}] ${ar.snapshot.data.title}` : ar.snapshot.data.title;
    this.titleService.setTitle(title);
  }

  /**
   * Method that returns last child of active route
   * @param activatedRoute 
   * @returns 
   */
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) return this.getChild(activatedRoute.firstChild);

    return activatedRoute;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   window.innerWidth <= 1024 && this.authenticationService.role==='admin' ? this.isDesktopScreen = false : this.isDesktopScreen = true;
  // }
}
