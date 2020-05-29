import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { AppService, GameStep } from './shared/appService';
import { DialogService } from './dialog/dialog.service';
import { DialogMode } from './dialog/dialogMode';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tajniaki';
  
  private dialog: DialogService;

  // TODO: można to przenieść do AppService
  private  menuShow = false;


  constructor (private router:Router, private injector: Injector){
    this.dialog = injector.get(DialogService);
  }

  openMenu(){
    console.log("Otwarto menu");
    this.menuShow = !this.menuShow;
  }

  areMenuItemHidden(){
    return !this.menuShow;
  } 

  isMenuHidden(){
    return AppService.getCurrentStep() == GameStep.MAIN;
  }

  goToMenu(){
    this.menuShow = false;
    this.dialog.setMessage("Czy na pewno wyjść").setMode(DialogMode.ALERT).setOnOkClick(()=>{
      this.dialog.close();
      this.menuShow = false;
      this.router.navigate(['mainmenu']);
    }).setOnCancelClick(()=>{
      this.dialog.close();
    }).open(DialogComponent);
  }

}


