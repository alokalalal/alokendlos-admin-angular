import { ZingchartAngularComponent } from 'zingchart-angular';

// Zingchart doesn't provide a proper types of functions and properties. This interface will add those missing
// functions & properties. This gives us a flexibility to use typing.
interface MissingZingChartFunctions {
    print(): void;
    saveasimage(json: object):any;
    downloadCSV(json: object):any;
    downloadXLS(json: object):any;
    getimagedata(json: object):any;
    downloadRAW():any;
    resize(object: object):any;
    addobject(object: object):any;
    removeobject(object: object):any;
}
declare type CustomZingChartAngularComponent = ZingchartAngularComponent & MissingZingChartFunctions;
