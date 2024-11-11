
export class Role {
    id: number;
    name: string;
    roleModuleRightsViews: any[];
    constructor(role: Role) {
      this.id = role.id
      this.name = role.name;
      this.roleModuleRightsViews = role.roleModuleRightsViews
    }
}
export const RoleTemplate = {
  'id' : Number(),
  'name': '',
  'roleModuleRightsViews': []
}