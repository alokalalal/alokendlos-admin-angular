export class ChangePassword{
    oldPassword: string;
    password: string;
    confirmPassword: string
    constructor(changePassword: ChangePassword){
        this.oldPassword = changePassword.oldPassword;
        this.password = changePassword.password;
        this.confirmPassword = changePassword.confirmPassword;
    }
}
