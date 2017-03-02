import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[navScroll]'
})
export class NavScrollDirective {
  constructor(private el: ElementRef) { }

  @HostListener('window:scroll', ['$event']) private onScroll($event: Event): void {
    let cover = document.getElementById('top-cover');
    if (window.scrollY > 1) {
      this.highlight('rgba(20, 20, 20, 0.96)');
      // this.highlight(window.scrollY > cover.style.height?
      // 'rgba(160,0,0,1)':'rgba('+ Math.round(window.scrollY * 160/cover.style.height) + ',0,0,1)');
    } else {
      this.highlight(null);
    }
  };
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
