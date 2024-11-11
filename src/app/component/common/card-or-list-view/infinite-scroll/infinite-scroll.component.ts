import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy,AfterViewInit {

  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>;

  private observer!: IntersectionObserver;
  constructor(
    private host: ElementRef
  ) { }
  ngAfterViewInit(): void {
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.scrolled.emit();
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll';
  }

  get element() {
    return this.host.nativeElement;
  }
  

}
