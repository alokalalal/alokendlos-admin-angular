
export class CommonListResponse <Entity>{
    code : number;
    message : string;
    list : Array<Entity>;
    records: number;
    constructor(commonResponse: CommonListResponse<Entity> ){
        this.code = commonResponse.code;
        this.message = commonResponse.message;
        this.list = commonResponse.list;
        this.records = commonResponse.records;
    }
}