import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  gameButton;

  constructor(private router: Router) {
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.gameButton = document.getElementById("game_button");
    this.gameButton.onclick = () => {
      this.router.navigate(['board']);
    }
  }
}
