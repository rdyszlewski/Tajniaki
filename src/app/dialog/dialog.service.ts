import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, TemplateRef, Inject, Type } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogMode } from './dialogMode';
import { DOCUMENT } from '@angular/common';
import { DialogModel } from './dialogModel';

export type Content<T> = string | TemplateRef<T> | Type<T>

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private component: DialogComponent;
  private componentRef: ComponentRef<DialogComponent>;

  constructor(private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document
  ) { }
  
  model: DialogModel = new DialogModel;

  open<T>(content: Content<T>) {
    const factory = this.resolver.resolveComponentFactory(DialogComponent);
    const ngContent = this.resolveNgContent(content);
    const componentRef = factory.create(this.injector, ngContent);
    componentRef.instance.model = this.model;
    this.component = componentRef.instance;
    componentRef.hostView.detectChanges();

    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
    this.component.open();

    this.componentRef = componentRef;
  }

  resolveNgContent<T>(content: Content<T>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      // Template reference
      const viewRef = content.createEmbeddedView(null);
      this.applicationRef.attachView(viewRef);
      return [viewRef.rootNodes];
      
      } else if (content instanceof Type) {
      // Component
      const factory = this.resolver.resolveComponentFactory(content);
      const componentRef = factory.create(this.injector);
      this.applicationRef.attachView(componentRef.hostView);
      return [[componentRef.location.nativeElement]];
      }

    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return [[componentRef.location.nativeElement], [this.document.createTextNode('Second ng-content')]];
  }

  public close(){
    this.component.close();
    this.removeDialogComponentFromBody();
    
  }

  private removeDialogComponentFromBody(){
    this.applicationRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }

  public setMessage(message:string){
    this.model.message = message;
    return this;
  }

  public setMode(mode:DialogMode){
    this.model.mode = mode;
    return this;
  }

  public setOnOkClick(event){
    this.model.onOkEvent = event;
    return this;
  }

  public setOnCancelClick(event){
    this.model.onCancelEvent = event;
    return this;
  }

  // dialogComponentRef: ComponentRef<DialogComponent>

  
  // constructor(
  //   private componentFactoryResolver: ComponentFactoryResolver,
  //   private appRef: ApplicationRef,
  //   private injector: Injector
  // ) {
  //     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
  //     const componentRef = componentFactory.create(this.injector);
  //     this.dialogComponentRef = componentRef;
  //  }

  // appendDialogComponentToBody(){
  //   this.dialogComponentRef.hostView.detectChanges();
  //   this.appRef.attachView(this.dialogComponentRef.hostView);
  //   const domElem = (this.dialogComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  //   document.body.appendChild(domElem);
  // }

  // private removeDialogComponentFromBody(){
  //   this.appRef.detachView(this.dialogComponentRef.hostView);
  //   this.dialogComponentRef.destroy();
  // }

  // public addMessage(message:string){
  //   this.dialogComponentRef.instance.addMessage(message);
  //   return this;
  // }

  // public setMode(mode: DialogMode){
  //   this.dialogComponentRef.instance.setMode(mode);
  //   return this;
  // }

  // public setOnOkClickEvent(event){
  //   this.dialogComponentRef.instance.setOnOkClick(event);
  //   return this;
  // }

  // public setOnCancelClickEvent(event){
  //   this.dialogComponentRef.instance.setOnCancelClick(event);
  //   return this;
  // }

  // public show(){
  //   this.appendDialogComponentToBody();
  // }

  // public close(){
  //   this.removeDialogComponentFromBody();
  // }
}
