import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController} from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { NovaSenhaDTO } from '../../models/nova-senha.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  cred : NovaSenhaDTO = {
    email: ""
  };


  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };
  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService,
    public alertCtrl: AlertController) {

  }
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
    
    ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }
  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfullLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});

  }


  login(){
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.successfullLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});
   
   
  }
  signup() {
    this.navCtrl.push('SignupPage');
  }

  forgot(){
    this.auth.newPassword(this.creds)
    .subscribe(response => {
      console.log(response.headers.get("Authorization"));

    },
    error => {

    });
  }
  
}