import { Component, OnInit } from '@angular/core';
import { IPush } from '../core/interfaces/push.interface';
import { Platform } from '@ionic/angular';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { CoreService } from '../core/services/core.service';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tokenFirebase: string;
  segment = "G";
  listaNotificaciones: IPush[] = [];
  private options: ThemeableBrowserOptions = {
    statusbar: {
      color: '#b3100b'
    },
    toolbar: {
      height: 44,
      color: '#b3100b'
    },
    title: {
      color: '#ffffff',
      showPageTitle: true
    },
    backButton: {
      align: 'left',
      event: 'closePressed',
      wwwImage: '/assets/browser/back.png',
      wwwImagePressed: '/assets/browser/back.png'
    },
    backButtonCanClose: true
  }
  flagCarros = false;
  flagGorras = false;
  constructor(
    private fcm: FCM,
    private platform: Platform,
    private core: CoreService,
    private themeableBrowser: ThemeableBrowser
  ) { }

  async ngOnInit() {
    this.tokenFirebase = 'canaltest';
    await this.getPushToStorage();
    this.iniciarFCM();
  }

  private async getPushToStorage() {
    await this.core.showLoading();
    await this.platform.ready();
    this.listaNotificaciones = await this.core.getPushToStorage();
    this.orderArrayById();
    await this.core.hideLoading();
  }

  private async iniciarFCM() {
    await this.platform.ready();
    try {
      this.fcm.getToken().then(token => {
        this.tokenFirebase = token;
      });
    } catch (error) {
      console.error(error);
      this.core.showToast("No se pudo inicializar firebase.");
    }
    this.crearChannel();
    this.fcm.subscribeToTopic("general");
    this.procesarDataNotificacion();
  }

  private orderArrayById() {
    this.listaNotificaciones.sort((a, b) => b.id - a.id);
  }
  private procesarDataNotificacion() {
    this.fcm.onNotification().subscribe(
      data => {
        const { title, body, url, image } = data;
        this.listaNotificaciones.push(
          {
            id: (this.listaNotificaciones.length + 1),
            descripcion: body,
            img: image,
            title,
            url,
            type: data.segment,
            read: false
          }
        );
        this.orderArrayById();
        if (data.wasTapped) {
          this.segment = data.segment;
        }
        if (data.segment != this.segment) {
          this.core.showToast("Tienes una nueva notificación", 2000);
          if (data.segment == "C") {
            this.flagCarros = true;
          } else {
            this.flagGorras = true;
          }
        }
        this.core.setPushInStorage(this.listaNotificaciones);
      },
      err => {
        console.error(err);
      }
    )
  }
  private crearChannel() {
    this.fcm
      .createNotificationChannel({
        id: 'jonathan-quintana-channel',
        description: "JQ Channel",
        name: "JQ Channel",
        importance: "high",
        vibration: true
      })
      .then(() => console.log("Channel created"));
  }

  public openNotification(push: IPush) {
    this.themeableBrowser.create(push.url, '_blank', this.options);
    this.listaNotificaciones = this.listaNotificaciones.map(ntf => {
      if (ntf.id == push.id) {
        ntf.read = true;
      }
      return ntf;
    });
    this.core.setPushInStorage(this.listaNotificaciones);
  }

  segmentChanged() {
    if (this.segment == "C") {
      this.flagCarros = false;
    } else {
      this.flagGorras = false;
    }
  }

  onSwipeLeft() {
    this.segment ="C";
  }

  onSwipeRight() {
    this.segment = "G";
  }
}
