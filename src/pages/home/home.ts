import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  json_data: Array<object> = [{title: "Santu", description: "", date: ""}];
  xjson_data: Array<object> = [{title: string, description: sring, date: string}];
  constructor(public navCtrl: NavController, private ionStore: Storage, private fcm: FCM) {
    this.fcm.subscribeToTopic('post_update');
    this.fcm_process();
  }
  fcm_process()
  {
    this.fcm.onNotification().subscribe(data=>{
      this.ionic_storage_process(data);
    });

  }
  ionic_storage_process(data)
  {
    let new_data = {"title":data.title,"description":data.description,"date":data.updated_at};
    let json_data = [];
    json_data.push(new_data);
    this.ionStore.get('post_update').then((val) => {
      if(val != null)
      {
        let old_storage_array = JSON.parse(val);
        for (var i = 0; i < old_storage_array.length; i++) {
          json_data.push(old_storage_array[i]);
        }
        let save_val = JSON.stringify(json_data);
        alert("not null ---"+save_val);
        this.ionStore.set("post_update", save_val);
      }
      else
      {
        let save_val = JSON.stringify(json_data);
        alert("null ---"+save_val);
        this.ionStore.set("post_update", save_val);
      }
      this.showpostindiv();
    });
  }
  showpostindiv()
  {

    this.ionStore.get('post_update').then((val) => {
      if(val != null)
      {
        alert("show data - "+val);
        this.json_data = JSON.parse(val);
      }
    });
  }
  ionViewDidLoad()
  {
    this.showpostindiv();
    this.fcm_process();

    let show_post = "[{\"title\":\"Test1\",\"description\":\"test2\",\"date\":\"2017\"},{\"title\":\"test2\",\"descripion\":\"Test2\",\"date\":\"2017\"}]";
    this.json_data = JSON.parse(show_post);

  }
}
