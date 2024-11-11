import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, NgModel, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BlockUIModule } from "ng-block-ui";
import { NgOtpInputModule } from "ng-otp-input";
import { AppMaterialModule } from "src/app/app.material.module";
import { ActiveClass } from "src/app/constants/active-class";
import { AppUrl } from "src/app/constants/app-url";
import { ErrorMessageModule } from "src/app/shared/error/error-message/error-message.module";
import { AuthGuard } from "src/app/_guards/auth.guard";
import { ApplicationCommonComponentModule } from "../common/application.common.component.module";
import { BlockUiTemplateComponent } from "../common/block-ui-template/block-ui-template.component";
import { PrivateChangePasswordComponent } from "./private-change-password/private-change-password.component";
import { UserAddEditComponent } from "./user-add-edit/user-add-edit.component";
import { UserDetailViewComponent } from "./user-detail-view/user-detail-view.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserPrivateModule } from "./user-private.module";

@NgModule({    
      imports: [
        UserPrivateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ApplicationCommonComponentModule,
        AppMaterialModule,
        NgOtpInputModule,
        ErrorMessageModule,  
        BlockUIModule.forRoot({
            template : BlockUiTemplateComponent
        }),
        RouterModule.forChild([
            { 
              path: '',
              children: [
                { path: AppUrl.LIST_OPERATION, component: UserListComponent, canActivate: [AuthGuard], data: { title: 'User List | Endlos Admin', activeClass: ActiveClass.USER } },
                { path: AppUrl.ADD_OPERATION, component: UserAddEditComponent, data: { title: 'User Add| Endlos Admin', activeClass: ActiveClass.USER } },
                { path: AppUrl.EDIT_OPERATION + ':id', component: UserAddEditComponent, data: { title: 'User Edit| Endlos Admin', activeClass: ActiveClass.USER } },
                { path: AppUrl.CHANGE_PASSWORD, component: PrivateChangePasswordComponent, canActivate: [AuthGuard], data: { title: 'Private Change Password | Endlos Admin', activeClass: ActiveClass.USER } },
                { path: AppUrl.VIEW_OPERATION + ':id', component: UserDetailViewComponent, canActivate: [AuthGuard], data: { title: 'Machine View | Endlos Admin', activeClass: ActiveClass.USER } },              
            ]
            }
          ])
    ]
})

export class UserRoutingModule {}