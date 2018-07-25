import { Platform } from "react-native";
import codePush from "react-native-code-push";

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";

const metodos = {
  actualizarApp: () => {
    return new Promise((callback, reject) => {

      //Valido si soy beta tester
      Rules_Ajustes.isBetaTester()
        .then((test) => {

          //Keys iOS
          const key_ios = 'PfHTHuI72bZjyvJHN7-1mPEBLFxsrkFMKlHdf';
          const key_ios_test = 'onBKUESFsmHzCJxKPyXArfjMnG_W46fa5311-742e-48ec-9cca-e112c82a5ff2';

          //Key Android
          const key_android = 'yRjO-uUfAoarYJSJWHdTV1P5LYXmHyiWzMHdf';
          const key_android_test = 'EyHcx3BBhsiNHBOQWHtWhTLdlaUr46fa5311-742e-48ec-9cca-e112c82a5ff2';

          //Key actual
          const key = Platform.OS == 'ios' ? (test ? key_ios_test : key_ios) : (test ? key_android_test : key_android);

          //Mando a actualizar
          codePush.sync({
            deploymentKey: key,
            installMode: codePush.InstallMode.IMMEDIATE
          },
            //Status change
            (syncStatus) => {
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
                  reject('Error procesando la solicitud');
                  break;
              }
            },
            (progress) => { }
          );
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  getInitData: () => {

    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback({
          mantenimiento: false,
          backgroundColor: "rgba(230,230,230,1)",
          toolbar_BackgroundColor: "white",
          // "toolbar_BackgroundColor": "black",
          toolbar_Dark: false,
          // "toolbar_Dark": true,
          toolbar_Height: 56,
          statusBar_BackgroundColor: "white",
          // "statusBar_BackgroundColor": "black",
          statusBar_Dark: false,
          // "statusBar_Dark": true,
          url_placeholder_user_male: "https://servicios2.cordoba.gov.ar/cordobafiles/archivo/f_qdag0f9irgka9xj2l6mbll69gxmhlghezkmkj2mykg1pj0uuhwogqiqfic_c327l9gmyk9tutz1fuq0rc3_z2byq5gcg2j5tjpqcn6jid4x2rlv2nsaa2it7s64d7m2k4h7e_xegt2w8p79uvk4jj42a7uvrcfm1cn8jpq31o4raxvsv8ktwtsa_q6iqbxeop56c_zee/2",
          url_placeholder_user_female: "https://servicios2.cordoba.gov.ar/cordobafiles/archivo/f_zq38nzky73iwxm6fz4m812vx68ggr28xgokqfwx7zf9ws7rd6_s7mn985gcqtehf6vpicq_chqiv3_e9rdlsjal4pmw_uhnu9318riap_p07eoe5cd_q4z65kw304ataczwaihsic6t4lo0bh18qi81k86x6qlv_7z5q2ew6w1n8gbu772sdcd3e8mcnuw31ku8wtkkd/2"
        });
      }, 300);

      // fetch("https://cba147log.firebaseio.com/initData.json", { method: 'GET' })
      //   .then(response => response.json())
      //   .then(initData => {
      //     resolve(initData);
      //   });
    });
  }
}

export default metodos;