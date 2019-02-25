import { Injectable } from "@angular/core";



@Injectable({providedIn:'root'})
export class SoundsService{

    private ErrorAudio: HTMLAudioElement = new Audio('https://firebasestorage.googleapis.com/v0/b/arvin-8a261.appspot.com/o/error.wav?alt=media&token=b7ea59ac-20e3-4460-956c-6b3880836c9f');
    private SuccessAudio: HTMLAudioElement = new Audio('https://firebasestorage.googleapis.com/v0/b/arvin-8a261.appspot.com/o/success.wav?alt=media&token=e088d80d-c0a2-44dd-b9f1-cc5522d36cba');

    constructor(){}
    
    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }


    
    
    
}