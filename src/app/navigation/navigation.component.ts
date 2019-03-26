import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
    $("#menu-toggle").hide();
    $("#sidebar-wrapper").hide();
    
    this.showNav()
    this.authService.authTokenUpdateListener().subscribe(a=>{ 
      this.showNav()
    })
    
  }

  showNav(){
    if(!this.authService.isAuthenticated()){
      $("#wrapper").removeClass("toggled");
      $("#menu-toggle").hide();
      $("#sidebar-wrapper").hide();
      
      
    }
    else{
      $("#menu-toggle").show();
      $("#sidebar-wrapper").show();
      $("#wrapper").addClass("toggled");
      $("#menu-toggle").click(function(e) {
        e.preventDefault();
        if( $('#wrapper').hasClass("toggled")){
          $('#wrapper').removeClass("toggled");
        }
        else{
          $('#wrapper').addClass("toggled");
        }
      });
      $("#menu-toggle1").click(function(e) {
        e.preventDefault();
        if( $('#wrapper').hasClass("toggled")){
          $('#wrapper').removeClass("toggled");
        }
        else{
          $('#wrapper').addClass("toggled");
        }
      });
      $(".sidebar-item").click(function(e) {
        if($(window).width()<=768){
          $("#wrapper").removeClass("toggled");
        }else{
          $("#wrapper").addClass("toggled");
        }
      });
  
      // $(window).resize(function(e) {
      //   if($(window).width()<=768){
      //     $("#wrapper").removeClass("toggled");
      //   }else{
      //     $("#wrapper").addClass("toggled");
      //   }
      // });
    }
  }

  onLogout(){
    this.authService.logout();
  }
}
