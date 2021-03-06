import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];
  page : number =0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.loadData();    
    loader.dismiss();
  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
    .subscribe(response => {
      let start = this.items.length;
      this.items = this.items.concat(response['content']);
      let end = this.items.length - 1;
      console.log(this.page);
      console.log(this.items);
      this.loadImageUrls(start, end);
    },
    error => {      
    });
  }


  loadImageUrls(start : number, end: number){
    for (var i=start; i<= end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}_small.jpg`;
        },
        error => {});
    }
  }  
  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage', {produto_id : produto_id});
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: "Please wait...",          
      });
    loader.present();
    return loader;
  }
  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
      this.loadData();
       setTimeout(() => {
       refresher.complete();
    }, 2000);
  }
  doInfinit(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
       infiniteScroll.complete();
    }, 2000);
  }

}
