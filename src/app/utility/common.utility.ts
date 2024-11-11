export default class CommonUtility {

  static checkValueExistInArray(array: Array<any>, prop: string, value: number): boolean {
    // console.log("cALL")
    let isPresent: boolean = false;
    if (array != undefined) {
      if (String(prop).split(".") != undefined && String(prop).split(".").length > 1) {
        isPresent = array.some(function (el) {
          String(prop).split(".").forEach(element => {
            el = el[element];
          });
          return el === value
        });
      } else {
        isPresent = array.some(function (el) {
          return el[String(prop)] === value;
        });
      }
    }
    return isPresent;
  };

  static downloadFile(fileName: string, fileResponse: Blob | MediaSource) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(fileResponse);
    a.download = fileName;
    a.click();
  }

  static downloadPDFFile(fileName: string | undefined, fileResponse: any) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(fileResponse);
    a.download = (fileName as string) + '.pdf';
    a.click();
}
}