import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
@Pipe({
    name: 'bypassSecurityTrustResourceUrl'
})
export class BypassSecurityTrustResourceUrl implements PipeTransform {
    constructor(
        private sanitizer: DomSanitizer,
    ) { }
    transform(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}