import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimateFocusDark]'
})
export class AnimateFocusDarkDirective implements OnInit {

  @Input() initialBack : string | undefined;
  
  atributeGeneral = ` 
      transition : 0.222s;

  `;

  atributeStateDesactive = ``;

  atributeStateActive = `
  background:  rgba(0, 0, 0, 0.25);
  `;

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2) { }


  ngOnInit(): void {
    
    this.atributeStateDesactive =  `
    background: rgba(0, 0, 0, ${this.initialBack ? this.initialBack : '0' } );
    `;
   
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
