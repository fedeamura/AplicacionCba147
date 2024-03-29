import { Platform } from "react-native";
import codePush from "react-native-code-push";

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";

const metodos = {
  actualizarApp: () => {
    return new Promise((callback, reject) => {
      //Valido si soy beta tester

      Rules_Ajustes.isBetaTester()
        .then(test => {
          //Keys iOS
          const key_ios = "key1";
          const key_ios_test = "key2";

          //Key Android
          const key_android = "key3";
          const key_android_test = "key4";

          //Key actual
          const key = Platform.OS == "ios" ? (test ? key_ios_test : key_ios) : test ? key_android_test : key_android;

          //Mando a actualizar

          codePush.sync({
            deploymentKey: key,
            installMode: codePush.InstallMode.IMMEDIATE
          }, syncStatus => {
            switch (syncStatus) {
              case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                break;
              case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                break;
              case codePush.SyncStatus.INSTALLING_UPDATE:
                break;
              case codePush.SyncStatus.UP_TO_DATE:
                callback();
                break;
              case codePush.SyncStatus.UPDATE_IGNORED:
                callback();
                break;
              case codePush.SyncStatus.UPDATE_INSTALLED:
                callback();
                break;
              case codePush.SyncStatus.UNKNOWN_ERROR:
                reject("Error procesando la solicitud");
                break;
            }
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getInitData: () => {
    return new Promise((resolve, reject) => {
      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Ajustes/AppData";
      fetch(url, {
        method: "GET",
        headers: new Headers({
          Identificador: "identificador",
          Key: "key"
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          Rules_Ajustes.setVersionApp(data.return.version);
          resolve(data.return);

        })
        .catch(() => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
