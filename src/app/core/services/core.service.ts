import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IPush } from '../interfaces/push.interface';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  key: string = "key";
  constructor(
    private toast: ToastController,
    private nativeStorage: NativeStorage,
    private loading: LoadingController) { }
  
  public async showToast(message: string, tiempo: number = 5000){
    const toast = await this.toast.create(
      {
        message,
        duration: tiempo
      }
    );
    toast.present();
  }

  public setPushInStorage(listaPush: IPush[]) {
    this.nativeStorage.setItem(this.key, listaPush).then().catch(
      err => {
        this.showToast("No se pudo almacenar la notificación en el equipo");
        console.error(err);
      }
    )
  }

  public async getPushToStorage() {
    let datos: IPush[] = [];
    await this.nativeStorage.getItem(this.key).then(
      resp => datos = resp
    ).catch(
      err => {
        if (err.code == 2) {
          return;
        }
        console.error(err);
        this.showToast("No pudimos cargar las notificaciones guardadas previamente.");
      }
    );
    return datos;
  }

  public async showLoading(message: string = "Cargando...") {
    const loading = await this.loading.create(
      {
        message
      }
    );
    await loading.present();
  }

  public async hideLoading() {
    await this.loading.dismiss();
  }
}
