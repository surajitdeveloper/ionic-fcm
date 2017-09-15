import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private post_data = [];
  constructor(
    public navCtrl: NavController,
    private ionStore: Storage,
    private fcm: FCM,
    private platform: Platform) {
    this.platform.ready().then(() => {
      this.fcm.subscribeToTopic('post_update');
      this.fcmProcess();
    })
  }
  ionViewDidLoad() {
    let posts = JSON.parse(window.localStorage.getItem('posts'))
    if(posts){
      this.post_data = posts;
    }
  }
  private fcmProcess() {
    this.fcm.onNotification().subscribe(data => {
      let post_obj = {
        title: data.title,
        description: data.description,
        date: data.updated_at
      };
      if(data.wasTapped){
        console.log("Received in Background");
        let posts = window.localStorage.getItem('posts');
        let db_data = [];
        if(posts){
          db_data = JSON.parse(posts);
        }
        db_data.push(post_obj);
        window.localStorage.setItem('posts',JSON.stringify(db_data));
      }else{
        console.log("Received in Foreground");
        this.post_data.push(post_obj)
        console.log(this.post_data);
        this.ionStore.set('posts', JSON.stringify(this.post_data));
      }
    });
  }
}
