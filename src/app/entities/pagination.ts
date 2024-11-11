export class Pagination {
    start: number;
    pageSize: number;
    pageIndex: number;
    length: number;
    previousPageIndex: number;
    constructor(pagination: Pagination) {
      this.start = pagination.start
      this.pageSize = pagination.pageSize;
      this.pageIndex = pagination.pageIndex;
      this.length = pagination.length;
      this.previousPageIndex = pagination.previousPageIndex;
    }
  }