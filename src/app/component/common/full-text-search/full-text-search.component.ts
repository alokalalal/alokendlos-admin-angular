import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-full-text-search[placeHolder][fulltextsearch]',
  templateUrl: './full-text-search.component.html',
  styleUrls: ['./full-text-search.component.css']
})
export class FullTextSearchComponent implements OnInit {
  @Input() placeHolder = new String();
  @Output() fulltextsearch = new EventEmitter();

  public searchInput = new String();
  constructor() { }

  ngOnInit(): void {
  }

}
