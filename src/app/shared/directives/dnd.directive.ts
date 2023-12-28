import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @HostBinding('class.fileover') fileover: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();
  constructor() { }
  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt : any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt : any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = false;

  }
  @HostListener('drop', ['$event']) public ondrop(evt_: any) {
    evt_.preventDefault();
    evt_.stopPropagation();

    this.fileover = false;

    const files = evt_.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
