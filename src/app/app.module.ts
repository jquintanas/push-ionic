import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import * as Hammer from 'hammerjs';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HammerModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FCM,
    NativeStorage,
    ThemeableBrowser,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  bootstrap: [AppComponent],
})
export class AppModule { }
