
export class CommonResponse {
    code : number;
    message : string;
    constructor(commonResponse: CommonResponse ){
        this.code = commonResponse.code;
        this.message = commonResponse.message;
    }
}