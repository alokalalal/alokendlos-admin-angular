
export class CommonViewResponse <Entity>{
    code : number;
    message : string;
    accessToken : string;
    refreshToken : string;
    view : Entity;
  changeLocationView: any;
    constructor(commonResponse: CommonViewResponse<Entity> ){
        this.code = commonResponse.code;
        this.message = commonResponse.message;
        this.accessToken = commonResponse.accessToken;
        this.refreshToken = commonResponse.refreshToken;
        this.view = commonResponse.view;
    }
}