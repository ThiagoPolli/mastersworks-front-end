import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

 cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public loadingCtrl: LoadingController ) {
  }

  ionViewDidLoad() {
     let localUser = this.storage.getLocalUser();
     let loader = this.presentLoading();
     if (localUser && localUser.email) {
       this.clienteService.findByEmail(localUser.email)      
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        loader.dismiss();
        this.getImageIfExists();
      }, 
      error =>{
        if (error.status == 403){
          this.navCtrl.setRoot('HomePage');
         
        }
        loader.dismiss();
      });
     
   }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }
 getImageIfExists() {
   this.clienteService.getImageFromBucket(this.cliente.id)
   .subscribe(Response => {
     this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
   },
   error => {});
  }
  presentLoading() {
    const loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: "Please wait...",          
      });
    loader.present();
    return loader;
  }
}


