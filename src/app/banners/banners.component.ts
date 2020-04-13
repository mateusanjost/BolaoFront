import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Banner } from '../banner.interface';
import { ModalDirective } from 'angular-bootstrap-md';
import { BannersOrder } from '../banners-order.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  @ViewChild('basicModal', { static: true }) modalImg: ModalDirective;
  @ViewChild('deleteModal', { static: true }) modalDelete: ModalDirective;

  isLoaded: boolean = false;
  bannersList: Banner[] = [];
  bannersOrder: BannersOrder;
  fileName: any;
  formBanner: FormGroup;
  bannerToEdit: Banner;
  showImage: string;
  idToDelete: number;

  constructor(private appComponent: AppComponent, private configService: ConfigService,
    private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
    this.getOwnBanners();

    this.formBanner = new FormGroup({
      title: new FormControl(''),
      subtitle: new FormControl('')
    });

    this.fileName = "";
  }

  get title() {
    return this.formBanner.get('title');
  }
  
  get subtitle() {
    return this.formBanner.get('subtitle');
  }

  getOwnBanners(){
    this.configService.getOwnBanners(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.bannersList = data;
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.load-fail-info"), 4);
      console.log(error);
    });
  }

  changeOrder(posA: number, posB: number){
    this.array_move(this.bannersList, posA, posB);


  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

  onFileSelected(event) {
    console.log(event.target.files);
    this.fileName = event.target.files[0].name; 
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    let tt = this.formBanner.value.title;
    let st = this.formBanner.value.subtitle;

    console.log(this.formBanner.value.title + " " + this.formBanner.value.subtitle);

    this.configService.postBanner(formData, this.appComponent.userAdmin.id, tt, st)
      .subscribe(data => {
        this.appComponent.msgStandard(this.translate.instant("pg-banners.well-done"), this.translate.instant("pg-banners.upload-successfull-info"), 3);
        this.ngOnInit();
      }, error => {
        //alert("Falhou o envio");
        this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.upload-fail-info"), 4);
        console.log(error);
      });
  }

  openImage(bannerId: number){
    console.log(bannerId);
    let img = this.bannersList.find(x => x.id == bannerId).fileName;

    this.showImage = "<img class='img-responsive' src='../../assets/banners/" + img +"' width='100%'/>";

    this.modalImg.show();
  }

  deleteDialog(bannerId: number){
    this.modalDelete.show();
    this.idToDelete = bannerId;
  }

  deleteBanner(){
    this.modalDelete.hide();
    let bannerId = this.idToDelete;

    this.configService.deleteBanner(bannerId, this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.well-done"), this.translate.instant("pg-banners.delete-successfull-info"), 3);
      this.ngOnInit();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.delete-fail-info") + " ("+
      error.message +")", 4);
      console.log(error);
    })
  }

  saveBannersState(){
    this.bannersList.forEach(element => {
      let tt = (<HTMLInputElement>document.getElementById("title" + element.id)).value;
      let st = (<HTMLInputElement>document.getElementById("subtitle" + element.id)).value;

      element.title = tt;
      element.subtitle = st;
    });

    this.configService.saveBannerState(this.appComponent.userAdmin.id, this.bannersList)
    .subscribe(data => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.well-done"), this.translate.instant("pg-banners.upload-successfull-info"), 3);
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.upload-fail-info"), 4);
    })
  }
}
