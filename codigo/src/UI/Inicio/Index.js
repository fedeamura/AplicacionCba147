import React from "react";
import { View, StyleSheet, ScrollView, BackHandler } from "react-native";
import {
  Dialog,
  Paragraph,
  Button as ButtonPeper,
  DialogActions,
  DialogContent
} from "react-native-paper";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbarMenu from "@Utils/MiToolbarMenu";
import PaginaInicio from "@Paginas/Requerimientos/Index";
import PaginaPerfil from "@Paginas/Perfil/Index";
import PaginaAjustes from "@Paginas/Ajustes/Index";
import MiPanelError from "@Utils/MiPanelError";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

export default class Inicio extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    const initData = global.initData;
    this.state = {
      expandido: false,
      dialogoConfirmarSalidaVisible: false,
      opciones: [
        {
          backgroundColor: initData.colorVerde,
          titulo: texto_Menu_MisRequerimientos,
          tituloColor: "white",
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: "file-document",
          iconoFontSize: 48,
          iconoColor: "white",
          valor: 0,
          contenido: <PaginaInicio />
        },
        {
          backgroundColor: initData.colorNaranja,
          titulo: texto_Menu_MiPerfil,
          tituloColor: "white",
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: "account-circle",
          iconoFontSize: 48,
          iconoColor: "white",
          valor: 1,
          contenido: <PaginaPerfil />
        },
        {
          backgroundColor: initData.colorRosa,
          titulo: texto_Menu_Ajustes,
          tituloColor: "white",
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: "settings",
          iconoColor: "white",
          iconoFontSize: 48,
          valor: 2,
          contenido: <PaginaAjustes />
        }
      ],
      cargando: true,
      validadoRenaper: false,
      mostrandoPanelRenaper: false
    };

    //Back
    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      function() {
        BackHandler.addEventListener("hardwareBackPress", this.back);
      }.bind(this)
    );

    this._willBlurSubscription = props.navigation.addListener(
      "willBlur",
      function() {
        BackHandler.removeEventListener("hardwareBackPress", this.back);
      }.bind(this)
    );
  }

  componentDidMount() {
    // alert("Inicio");
    this.consultarUsuarioValidadoRenaper();
  }

  back = () => {
    if (this.state.expandido == true) {
      return false;
    }

    this.setState({ dialogoConfirmarSalidaVisible: true });
    return true;
  };

  consultarUsuarioValidadoRenaper = () => {
    this.setState(
      {
        cargando: true,
        error: undefined,
        mostrandoPanelRenaper: false
      },
      () => {
        Rules_Usuario.esUsuarioValidadoRenaper()
          .then(validado => {
            this.setState({
              cargando: false,
              validadoRenaper: validado,
              mostrandoPanelRenaper: validado == false
            });
          })
          .catch(error => {
            this.setState({
              cargando: false,
              validadoRenaper: false,
              mostrandoPanelRenaper: true,
              error: error
            });
          });
      }
    );
  };

  onBtnValidarClick = () => {
    App.navegar("UsuarioValidarDatosRenaper", {
      callback: () => {
        this.consultarUsuarioValidadoRenaper();
      }
    });
  };

  onBtnRecargarClick = () => {
    this.consultarUsuarioValidadoRenaper();
  };

  onToolbarMenuOpen = () => {
    this.setState({ expandido: true });
  };

  onToolbarMenuClose = () => {
    this.setState({ expandido: false });
  };

  ocultarDialogoConfirmarSalida = () => {
    this.setState({ dialogoConfirmarSalidaVisible: false });
  };

  onConfirmarSalida = () => {
    this.setState(
      {
        dialogoConfirmarSalidaVisible: false
      },
      () => {
        BackHandler.exitApp();
      }
    );
  };

  render() {
    if (this.state.cargando == true) return null;

    const initData = global.initData;
    const colorToolbar = initData.toolbarDark ? "white" : "black";

    //Mostrando panel validar renaper
    if (this.state.mostrandoPanelRenaper == true) {
      if (this.state.error != undefined) {
        //Error consultando usuario
        const textoError = undefined;
        const textoDetalle = this.state.error;

        return (
          <View>
            <MiPanelError
              titulo={textoError}
              detalle={textoDetalle}
              mostrarBoton={true}
              icono="alert-circle-outline"
              onBotonPress={this.onBtnRecargarClick}
              textoBoton={texto_Boton_VolverConsultarUsuarioValidado}
            />

            {this.renderDialogoConfirmarSalida()}
          </View>
        );
      } else {
        //Usuario no validado
        const textoError = texto_UsuarioNoValidado;
        const textoDetalle = texto_UsuarioNoValidadoDetalle;
        return (
          <View>
            <MiPanelError
              titulo={textoError}
              detalle={textoDetalle}
              mostrarBoton={true}
              onBotonPress={this.onBtnValidarClick}
              textoBoton={texto_Boton_ValidarUsuario}
            />

            {this.renderDialogoConfirmarSalida()}
          </View>
        );
      }
    }

    return (
      <View
        style={[
          styles.contenedor,
          { backgroundColor: initData.backgroundColor }
        ]}
      >
        <MiStatusBar />

        <MiToolbarMenu
          toolbarHeight={initData.toolbarHeight}
          toolbarBackgroundColor={initData.toolbarBackgroundColor}
          toolbarTituloColor={colorToolbar}
          opciones={this.state.opciones}
          expandirAlHacerClick={false}
          mostrarBotonCerrar={true}
          iconoCerrar="close"
          iconoCerrarColor="white"
          mostrarBotonIzquierda={true}
          iconoIzquierdaColor={colorToolbar}
          iconoIzquierda="menu"
          onExpandido={this.onToolbarMenuOpen}
          onSeleccionChange={this.onToolbarMenuClose}
        />

        {this.renderDialogoConfirmarSalida()}
      </View>
    );
  }

  renderDialogoConfirmarSalida() {
    return (
      <Dialog
        style={{ borderRadius: 16 }}
        visible={this.state.dialogoConfirmarSalidaVisible}
        onDismiss={this.ocultarDialogoConfirmarSalida}
      >
        <DialogContent>
          <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
            <Paragraph>{texto_DialogoConfirmarSalir}</Paragraph>
          </ScrollView>
        </DialogContent>
        <DialogActions>
          <ButtonPeper onPress={this.ocultarDialogoConfirmarSalida}>
            No
          </ButtonPeper>
          <ButtonPeper onPress={this.onConfirmarSalida}>Si</ButtonPeper>
        </DialogActions>
      </Dialog>
    );
  }
}

const texto_DialogoConfirmarSalir =
  "¿Esta seguro que desea salir de la aplicación #CBA147?";

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  }
});

//Textos
const texto_Titulo = "Inicio";
const texto_Menu_MisRequerimientos = "Mis requerimientos";
const texto_Menu_MiPerfil = "Mi perfil";
const texto_Menu_Ajustes = "Ajustes";

//Sin validar
const texto_UsuarioNoValidado = "Usuario no validado";
const texto_UsuarioNoValidadoDetalle =
  "A partir de ahora para utilizar #CBA147 su información debe estar validada formalmente a través del Registro Nacional de las Personas.";
const texto_Boton_ValidarUsuario = "Validar usuario";
const texto_Boton_VolverConsultarUsuarioValidado = "Actualizar";
