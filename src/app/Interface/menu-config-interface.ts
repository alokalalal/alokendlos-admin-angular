export interface MenuConfigInterface {
    activeClass : string;
    name : string;
    iconUrl? : string;
    iconWhiteUrl? : string;
    url? : string;
    moduleId? : Array<number | string>;
    childMenu? : Array<MenuConfigInterface>;
    headerMenu? : Array<MenuConfigInterface>;
    isActive? : boolean;
    iconClassName? : string;   
}