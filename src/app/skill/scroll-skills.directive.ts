import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[myScrollSkills]'
})

export class ScrollSkillsDirective {
  @Output() onScrollEvent = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('scroll') scroll() {
    const skillSectionElement = this.elementRef.nativeElement;
    const lastShowedSkill = skillSectionElement.querySelector('li:last-child');
    if (lastShowedSkill.offsetTop + lastShowedSkill.offsetHeight <= skillSectionElement.offsetHeight + skillSectionElement.scrollTop) {
      this.onScrollEvent.emit();
    }
  }
}
