import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  contact(){
    window.open(`mailto:${'v.bharathkumar@gmail.com'}`, '_system');
  }
}
