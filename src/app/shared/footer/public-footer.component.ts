import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-footer',
  templateUrl: './public-footer.component.html'
})
export class PublicFooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  goToSection(divId : string){
    document.getElementById(divId)?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  

}
