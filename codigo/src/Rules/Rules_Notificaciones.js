import { Alert } from "react-native";
import firebase from 'react-native-firebase';

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Usuario from "@Rules/Rules_Usuario";

const metodos = {

  notificar: (data) => {
    try {
      const notification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      });

      notification.setTitle(data.Titulo || 'Titulo');
      notification.setBody(data.Detalle || 'Detalle');
      notification.setNotificationId(`id_${Date.now()}`);
      notification.setData(data || {});
      notification.setSound("default");
      notification.android.setChannelId('channelId')
      notification.android.setColor('#000000')
      notification.android.setSmallIcon('ic_launcher');
      notification.android.setAutoCancel(true);
      notification.android.setPriority(firebase.notifications.Android.Priority.Max);
      firebase.notifications().displayNotification(notification);
    } catch (ex) {

    }
  },

  crearNotificacionDePrueba: () => {
    Rules_Notificaciones.notificar({
      Titulo: 'Titulo',
      Detalle: 'Detalle',
      Accion: 'requerimiento_detalle',
      Data: 1
    })
  },

  transformarNotificacion: (notificacion) => {
    try {
      if (notificacion == undefined) {
        notificacion = {};
      }
      if (notificacion.data == undefined) {
        notificacion.data = {}
      };

      let titulo = notificacion.title || 'Sin titulo';
      let detalle = notificacion.body || 'Sin detalle';
      let accion = notificacion.data.accion || 'Sin accion';
      let data = notificacion.data.data || 'Sin data';

      return {
        Titulo: titulo,
        Detalle: detalle,
        Accion: accion,
        Data: data
      }
    } catch (ex) {
      return null;
    }
  },

  manejar: (notificacion) => {
    Rules_Usuario.isLogin()
      .then((login) => {
        if (login != true) return;

        switch (notificacion.Accion) {
          case 'detalle_requerimiento': {
            Alert.alert('', 'Debo abrir un detalle de rq');
          } break;
        }

      })
      .catch((error) => {

      });
  },

  autoEnviarNotificacion: () => {
    return new Promise((callback, callbackError) => {
      const url = 'https://fcm.googleapis.com/fcm/send';

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "key=AAAAH37Ya8M:APA91bEt4hF0hXddzYxAfU_YUK5fdzOSiNO58iMUAroeW_OcXpAxlkXlg4WTDqz3qfVP-3Govt9QPeqpfDRR4ZAxzUhszNhvUwj1v7f2zDIkK-QdD4d8dgaTRqaHeYun_nEsBbuIJd50",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({
          to: global.notificationToken,
          notification: {
            title: 'Titulo',
            body: 'Detalle'
          },
          data: {
            accion: 'test',
            data: 'notificacion de prueba'
          },
          ttl: 3600
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.success == 1) {
            callback();
          } else {
            callbackError('Error enviando');
          }
        })
        .catch((ex) => {
          callbackError('Error procesando la solicitud');
        })
    });
  },

  guardarFcmToken: (fcmToken) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/AgregarFCMToken?token={token}&fcmToken={fcmToken}";
      url = url.replace("{token}", global.token);
      url = url.replace("{fcmToken}", fcmToken);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok == false) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
}

export default metodos;