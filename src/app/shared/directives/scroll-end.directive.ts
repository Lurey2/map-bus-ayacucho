import { Directive, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';


@Directive({
  selector: '[appScrollEnd]'
})
export class ScrollEndDirective {
  @Output() scrollEnd = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = this.el.nativeElement as HTMLElement;

    if (element.scrollHeight - Math.ceil(element.scrollTop) <= element.clientHeight) {
      this.scrollEnd.emit();
    }
  }
}
