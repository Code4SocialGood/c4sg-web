import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[myNavScroll]'
})

export class NavScrollDirective {
  constructor(private el: ElementRef) { }

  @HostListener('window:scroll', ['$event']) public onScroll($event: Event): void {
    const cover = document.getElementById('top-cover');
    let colorIndex = 0;
    if (window.scrollY > 1) {
      colorIndex = Math.round(window.scrollY);
      const x = this.colorDef(0, 0, 0, 1, window.scrollY);
      this.highlight((window.scrollY > 500 ?
        'rgba(160,0,0,1)' : this.colorDef(40, 40, 40, 1, window.scrollY)), '0px 1px 2px #999999');
    } else {
      this.highlight(null, null);
    }
  };
  private highlight(color: string, shadow: string) {
    this.el.nativeElement.style.backgroundColor = color;
    // this.el.nativeElement.style.boxShadow = shadow;
  }
  private colorDef(r, g, b, a, scroll ) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + (a * scroll / 200) + ')';
  }
}
