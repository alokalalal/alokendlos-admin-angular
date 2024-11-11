import { Observable } from 'rxjs';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonResponse } from "../responses/common-response";
import { CommonViewResponse } from "../responses/common-view-response";


​
export interface AppListService {
  doView?(data : any) : CommonViewResponse<any>;
  doEdit?(data : any) : CommonViewResponse<any>;
  doActiveInactive?(data : any) : CommonResponse;
  doDelete?(data : any) : CommonResponse;
  doSearch(start: number, recordSize: number, body: any): Observable<any>;
  searchFilter : any;
  searchFilterArray : Array<ListContainerAdvanceSearchFilterInterface>;
}