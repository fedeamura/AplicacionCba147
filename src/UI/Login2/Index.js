import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  Keyboard,
  WebView
} from "react-native";

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from "@Utils/MiStatusBar";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class Login extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      requiereLogin: false,
      cargando: false
    };

    this.anim = new Animated.Value(0);
  }

  componentDidMount() {
    this.consultarLogin();
  }

  consultarLogin = async () => {
    try {
      this.setState({ requiereLogin: false });
      let vista = await Rules_Ajustes.esIntroVista();
      if (vista == false) {
        App.navegar("Introduccion", {
          callback: () => {
            this.consultarLogin();
          }
        });
        return;
      }

      let login = await Rules_Usuario.isLogin();
      if (login == true) {
        App.replace("Inicio");
        return;
      }

      this.setState({ requiereLogin: true });
    } catch (error) {
      Alert.alert("", JSON.stringify(error), [
        { text: "Reintentar", onPress: this.consultarLogin }
      ]);
    }
  };

  onNavigationStateChange = webViewState => {
    if (this.state.ready == true) return;
    let url = webViewState.url;
    if (url.indexOf("appcba147.com") != -1) {
      this.setState({ ready: true });
      this.login(url.split("?token=")[1]);
    }
  };

  login = async token => {
    try {
      Keyboard.dismiss();
      await Rules_Usuario.setLogin(token);
      App.replace("Inicio");
    } catch (ex) {
      Alert(JSON.stringify(ex));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.requiereLogin == true && (
          <WebView
            onNavigationStateChange={this.onNavigationStateChange}
            style={styles.webview}
            source={{
              uri:
                "https://servicios2.cordoba.gov.ar/muniOnlineLogin/#/login/appcba147?modoApp=true&appNombre=Cba147"
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  webView: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0
  }
});

const texto_Titulo = "Iniciar sesión";
const texto_ErrorGenerico = "Error procesando la solicitud";
