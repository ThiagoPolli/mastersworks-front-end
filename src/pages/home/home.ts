import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };
  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService,
    public loadingCtrl: LoadingController) {

  }
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
    
    ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }


  login(){
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.successfullLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});
   
   
  }
  
  presentLoading() {
    this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 3000,
      dismissOnPageChange: true
    }).present();
  }
  
}
