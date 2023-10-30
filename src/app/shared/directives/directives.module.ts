import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndDirective } from './dnd.directive';
import { AnimateShowEventDirective } from './animate-show-event.directive';
import { AnimateFocusDarkDirective } from './animate-focus-dark.directive';
import { ScrollEndDirective } from './scroll-end.directive';



@NgModule({
  declarations: [DndDirective, AnimateShowEventDirective, AnimateFocusDarkDirective, ScrollEndDirective],
  exports : [DndDirective,AnimateShowEventDirective ,AnimateFocusDarkDirective,ScrollEndDirective ],
  imports: [
    CommonModule,
  ]
})
export class DirectivesModule { }
