import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector:'[appScrollSkills]'
})

export class ScrollSkillsDirective {
  @Output() onScrollEvent = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('scroll') scroll(eventData: Event) {
    let skillSectionElement = this.elementRef.nativeElement;
    let lastShowedSkill = skillSectionElement.querySelector('li:last-child');
    if (lastShowedSkill.offsetTop + lastShowedSkill.offsetHeight <= skillSectionElement.offsetHeight + skillSectionElement.scrollTop) {
      this.onScrollEvent.emit();
    }
  }
}
