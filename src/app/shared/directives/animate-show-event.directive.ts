import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateShowEvent]'
})
export class AnimateShowEventDirective implements OnInit {

  atributeGeneral = ` 
      transition : 0.222s;

  `;

  atributeStateDesactive = `
    opacity: 0.2;
  `;

  atributeStateActive = `
  opacity: 1;
  `;

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2) { }


  ngOnInit(): void {
    
    this.elementRef.nativeElement.setAttribute('style' , this.atributeGeneral+ this.atributeStateDesactive);
  }
  
  @HostListener('mouseenter') 
  onMouseEnter() {
    this.elementRef.nativeElement.setAttribute('style' , this.atributeGeneral+ this.atributeStateActive);
  }
 
  @HostListener('mouseleave') 
  onMouseLeave() {
    this.elementRef.nativeElement.setAttribute('style' , this.atributeGeneral+ this.atributeStateDesactive);
  
  }
}
