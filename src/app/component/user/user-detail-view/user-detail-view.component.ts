import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { UserView } from 'src/app/view/common/user-view';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { AppUrl } from './../../../constants/app-url';


@Component({
  selector: 'app-user-detail-view',
  templateUrl: './user-detail-view.component.html',
  styleUrls: ['./user-detail-view.component.css']
})
export class UserDetailViewComponent implements OnInit {
  @BlockUI('userDetailView') userDetailViewBlockUi!: NgBlockUI
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;


  public userView: UserView = new UserView();

    appUrl = AppUrl;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackBarService,
    private componentFactoryResolver: ComponentFactoryResolver,

  ) { }

  ngOnInit(): void {
    this.userDetailViewBlockUi.start();
        let machineId: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (machineId == undefined) {
            this.router.navigate([AppUrl.MACHINE + '/' + AppUrl.LIST_OPERATION])
        } else {
            this.userService.doView(machineId).subscribe((response: CommonViewResponse<UserView>) => {
                if (response != undefined && response.code >= 1000 && response.code < 2000) {
                    this.userView = new UserView(response.view);
                    this.userDetailViewBlockUi.stop();
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
            })
        }
    }

    edit() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserAddEditComponent);
      const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
      componentRef.instance.dynamicComponentData = this.userView;
      componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
          if (isReloadListData) {
            this.ngOnInit()
          }
          this.dynamicComponentContainer.detach();
      });
  }
  }


