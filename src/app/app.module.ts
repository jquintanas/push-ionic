import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ThemeableBrowser} from '@ionic-native/themeable-browser/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FCM, NativeStorage, ThemeableBrowser],
  bootstrap: [AppComponent],
})
export class AppModule {}
