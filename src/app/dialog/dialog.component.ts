import { Component, Type, AfterViewInit, OnDestroy } from '@angular/core';
import { DialogMode } from './dialogMode';
import { registerLocaleData } from '@angular/common';
import { DialogModel } from './dialogModel';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements AfterViewInit, OnDestroy {

 // TODO: zrobić ustawianie ikonki

  dialogMode = DialogMode;
  model:DialogModel = new DialogModel();

  state: string = "close";

  ngAfterViewInit(){

  }

  ngOnDestroy(){

  }

  onOverlayClicked(event: MouseEvent){

  }

  onDialogClicked(event: MouseEvent){
    event.stopPropagation;
  }

  public open(){
    this.state = 'open';
  }

  public close(){
    this.state = 'close';
  }

  isOpen(){
    return this.state == 'open';
  }

}
