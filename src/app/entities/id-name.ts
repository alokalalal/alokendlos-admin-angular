export class IdName {
    id: number | string;
    name?: string;
    constructor(idName: IdName) {
      this.id = idName.id
      this.name = idName.name;
    }
  }

export const IdNameTemplate = {
  'id' : Number(),
  'name': '',
}