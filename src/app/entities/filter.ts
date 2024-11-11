export class Filter {
    constructor(filter: Filter) {
      this.fullTextSearch = filter.fullTextSearch
    }
    fullTextSearch: string;
  }