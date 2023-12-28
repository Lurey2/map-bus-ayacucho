import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipePipe } from './sanitize-html-pipe.pipe';



@NgModule({
  declarations: [SanitizeHtmlPipePipe],
  exports : [SanitizeHtmlPipePipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
