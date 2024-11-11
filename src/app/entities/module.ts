import { Rights } from './rights';

export class Module {
    constructor(module: Module) {
      this.id = module.id
      this.name = module.name;
      this.rightsViews = module.rightsViews;
    }
    id: number;
    name: string;
    rightsViews: Array<Rights>;
  }