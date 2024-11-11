import { Component, OnInit } from '@angular/core';
import { AppUrl } from 'src/app/constants/app-url';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public appUrl = AppUrl;
  public errorCode!: number;
  public errorTitle!: string;
  public errorMessage!: string
  public backMessage!: string;
  public backPageLink!: string;

  constructor(private router: Router) {
    if(router.url == ('/' + this.appUrl.ERROR + '/' + this.appUrl.PAGE_NOT_FOUND)){
      this.errorCode = 404;
      this.errorTitle = "Page Not Found";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/';
    }else if(router.url == ('/' + this.appUrl.ERROR + '/' + this.appUrl.INTERNAL_SERVER_ERROR)){
      this.errorCode = 500;
      this.errorTitle = "Internal Server Error";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/';
    }else if(router.url == ('/' + this.appUrl.ERROR + '/' + this.appUrl.SERVICE_UNAVAILABLE)){
      this.errorCode = 503;
      this.errorTitle = "Service Unavailable";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }else if(router.url == ('/' + this.appUrl.ERROR + '/' + this.appUrl.UNAUTHORIZED)){
      this.errorCode = 401;
      this.errorTitle = "Unauthorized Access";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }else if(router.url == ('/' + this.appUrl.ERROR + '/' + '/' + this.appUrl.FORBIDDEN)){
      this.errorCode = 403;
      this.errorTitle = "Forbidden";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }else if(router.url == ('/' + this.appUrl.ERROR + '/' + this.appUrl.BAD_GATEWAY)){
      this.errorCode = 502;
      this.errorTitle = "Bad Gateway";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }else if(router.url == ('/' + this.appUrl.ERROR + '/'  + this.appUrl.BAD_REQUEST)){
      this.errorCode = 400;
      this.errorTitle = "Bad Request";
      this.errorMessage = "Error message";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }else if(router.url == ('/' + this.appUrl.ERROR + '/'  + this.appUrl.ERROR)){
      this.errorCode = 2009;
      this.errorTitle = "2009 Error";
      this.errorMessage = "Link is expired or have already been used";
      this.backMessage = "Go Back";
      this.backPageLink = '/'
    }
  }

  ngOnInit(): void {
  }

}
