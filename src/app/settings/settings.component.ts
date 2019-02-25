import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from '../shared/token.service';
import { Subscription } from 'rxjs';
import { SoundsService } from '../shared/sounds.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  form;
  credentials;
  fullName;
  tokenSub: Subscription;
  constructor(private tokenService: TokenService, private soundService: SoundsService) { }

  ngOnInit() {

    this.credentials = this.tokenService.getCredentials();
    this.form = new FormGroup({
      token: new FormControl(null, Validators.required),
      applicationId: new FormControl(null, Validators.required),
      applicationSecret: new FormControl(null, Validators.required),
    });

    

    this.fullName = this.tokenService.getName();
    this.tokenSub = this.tokenService.nameUpdateListener().subscribe(name=>{
      this.fullName = name;
    })
  }

  updateToken(){
    if(this.form.invalid){
      this.soundService.playError();
    }
    this.tokenService.updateToken(this.form.value.token,
                                  this.form.value.applicationId,
                                  this.form.value.applicationSecret);

  }

  ngOnDestroy(){
    this.tokenSub.unsubscribe();
  }
}
