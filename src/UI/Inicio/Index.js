import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
  BackHandler
} from "react-native";

import {
  Dialog,
  Paragraph,
  Button as ButtonPeper,
  DialogActions,
  DialogContent
} from 'react-native-paper';
import autobind from 'autobind-decorator'

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

    this.state = {
      expandido: false,
      dialogoConfirmarSalidaVisible: false,
      opciones: [
        {
          backgroundColor: '#01a15a',
          titulo: texto_Menu_MisRequerimientos,
          tituloColor: 'white',
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: 'file-document',
          iconoFontSize: 48,
          iconoColor: 'white',
          valor: 0,
          contenido: (<PaginaInicio />)
          // botones: (<View><Text>Hola</Text></View>)
        },
        {
          backgroundColor: '#f68a1e',
          titulo: texto_Menu_MiPerfil,
          tituloColor: 'white',
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: 'account-circle',
          iconoFontSize: 48,
          iconoColor: 'white',
          valor: 1,
          contenido: (<PaginaPerfil />)
        },
        {
          backgroundColor: '#c6148c',
          titulo: texto_Menu_Ajustes,
          tituloColor: 'white',
          tituloFontSize: 18,
          tituloFontSpace: 2,
          icono: 'settings',
          iconoColor: 'white',
          iconoFontSize: 48,
          valor: 2,
          contenido: (<PaginaAjustes />)
        }
      ],
      cargando: true,
      validadoRenaper: false,
      mostrandoPanelRenaper: false
    };

    //Back
    this._didFocusSubscription = props.navigation.addListener('didFocus', function (payload) {
      BackHandler.addEventListener('hardwareBackPress', this.back);
    }.bind(this));

    this._willBlurSubscription = props.navigation.addListener('willBlur', function (payload) {
      BackHandler.removeEventListener('hardwareBackPress', this.back);
    }.bind(this));

  }

  componentDidMount() {
    this.consultarUsuarioValidadoRenaper();
  }


  @autobind
  back() {
    if (this.state.expandido == true) {
      return false;
    }

    this.setState({ dialogoConfirmarSalidaVisible: true });
    return true;
  }

  @autobind
  consultarUsuarioValidadoRenaper() {
    this.setState({ cargando: true, error: undefined, mostrandoPanelRenaper: false },
      function () {
        Rules_Usuario.esUsuarioValidadoRenaper()
          .then(function (validado) {
            this.setState({
              cargando: false,
              validadoRenaper: validado,
              mostrandoPanelRenaper: validado == false
            });
          }.bind(this))
          .catch(function (error) {
            this.setState({
              cargando: false,
              validadoRenaper: false,
              mostrandoPanelRenaper: true,
              error: error
            });
          }.bind(this));
      }.bind(this));
  }

  @autobind
  onBtnValidarClick() {
    App.navegar('UsuarioValidarDatosRenaper', {
      callback: function () {
        this.consultarUsuarioValidadoRenaper();
      }.bind(this)
    });
  }

  @autobind
  onBtnRecargarClick() {
    this.consultarUsuarioValidadoRenaper();
  }

  @autobind
  onToolbarMenuOpen() {
    this.setState({ expandido: true });
  }

  @autobind
  onToolbarMenuClose() {
    this.setState({ expandido: false });
  }

  render() {
    if (this.state.cargando == true) return null;

    const initData = global.initData;
    const colorToolbar = initData.toolbar_Dark ? 'white' : 'black';

    //Mostrando panel validar renaper
    if (this.state.mostrandoPanelRenaper == true) {

      if (this.state.error != undefined) {
        //Error consultando usuario
        const textoError = undefined;
        const textoDetalle = this.state.error;

        return <View>
          <MiPanelError
            titulo={textoError}
            detalle={textoDetalle}
            mostrarBoton={true}
            icono="alert-circle-outline"
            onBotonPress={this.onBtnRecargarClick}
            textoBoton={texto_Boton_VolverConsultarUsuarioValidado} />

          {this.renderDialogoConfirmarSalida()}
        </View>
      } else {
        //Usuario no validado
        const textoError = texto_UsuarioNoValidado;
        const textoDetalle = texto_UsuarioNoValidadoDetalle;
        return <View>
          <MiPanelError
            titulo={textoError}
            detalle={textoDetalle}
            mostrarBoton={true}
            onBotonPress={this.onBtnValidarClick}
            textoBoton={texto_Boton_ValidarUsuario}
          />

          {this.renderDialogoConfirmarSalida()}
        </View>;
      }
    }

    return (
      <View
        style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <MiStatusBar />


        <MiToolbarMenu
          toolbarHeight={initData.toolbar_Height}
          toolbarBackgroundColor={initData.toolbar_BackgroundColor}
          toolbarTituloColor={colorToolbar}
          opciones={this.state.opciones}
          expandirAlHacerClick={false}
          mostrarBotonCerrar={true}
          iconoCerrar='close'
          iconoCerrarColor='white'
          mostrarBotonIzquierda={true}
          iconoIzquierdaColor={colorToolbar}
          iconoIzquierda='menu'
          onExpandido={this.onToolbarMenuOpen}
          onSeleccionChange={this.onToolbarMenuClose}
        />

        {this.renderDialogoConfirmarSalida()}
      </View>
    );
  }

  @autobind
  ocultarDialogoConfirmarSalida() {
    this.setState({ dialogoConfirmarSalidaVisible: false })
  }

  @autobind
  onConfirmarSalida() {
    this.setState({
      dialogoConfirmarSalidaVisible: false
    }, function () {
      BackHandler.exitApp();
    }.bind(this))
  }

  renderDialogoConfirmarSalida() {
    return <Dialog
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
        <ButtonPeper onPress={this.ocultarDialogoConfirmarSalida}>No</ButtonPeper>
        <ButtonPeper onPress={this.onConfirmarSalida}>Si</ButtonPeper>
      </DialogActions>
    </Dialog>
  }
}

const texto_DialogoConfirmarSalir = '¿Esta seguro que desea salir de la aplicación #CBA147?';

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  }
})


//Textos
const texto_Titulo = 'Inicio';
const texto_Menu_MisRequerimientos = 'Mis requerimientos';
const texto_Menu_MiPerfil = 'Mi perfil';
const texto_Menu_Ajustes = 'Ajustes';

//Sin validar
const texto_UsuarioNoValidado = "Usuario no validado";
const texto_UsuarioNoValidadoDetalle = "Para utilizar la aplicación debes validar tus datos contra el registro nacional de personas.";
const texto_Boton_ValidarUsuario = "Validar su usuario";
const texto_Boton_VolverConsultarUsuarioValidado = "Actualizar";