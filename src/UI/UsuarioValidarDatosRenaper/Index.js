import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  ScrollView,
  Keyboard,
} from "react-native";
import {
  Text,
  Spinner,
} from "native-base";
import {
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';
import FormDatosPersonales from '@UI/UsuarioNuevo/FormDatosPersonales';

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class UsuarioValidarDatosRenaper extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      datosUsuario: undefined,
      cargando: false,
      error: undefined,
      dialogoExitoVisible: false,
      dialogoConfirmarSalidaVisible: false
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  buscarDatosPersonales = () => {
    this.setState({ cargando: true }, () => {
      Rules_Usuario.getDatos().then((datos) => {
        this.setState({ cargando: false, datosUsuario: datos });
      });
    })
  }

  mostrarDialogoExito = () => {
    this.setState({ dialogoExitoVisible: true });
  }

  ocultarDialogoExito = () => {
    this.setState({ dialogoExitoVisible: false });
  }

  cerrar = () => {
    let preguntarCerrar = false;
    if (this.state.algoInsertadoEnDatosPersonales == true) {
      preguntarCerrar = true;
    }

    if (preguntarCerrar == true) {
      this.setState({ dialogoConfirmarSalidaVisible: true });
      return;
    }

    App.goBack();
  }

  onFormularioDatosPersonalesAlgoInsertado = (algoInsertado) => {
    this.setState({ algoInsertadoEnDatosPersonales: algoInsertado })
  }

  onDatosPersonalesReady = (datos) => {
    this.setState({ cargando: true }, () => {

      let comando = {
        Nombre: datos.Nombre,
        Apellido: datos.Apellido,
        Dni: datos.Dni,
        FechaNacimiento: datos.FechaNacimiento,
        SexoMasculino: datos.SexoMasculino
      };
      Rules_Usuario.actualizarDatosPersonales(comando)
        .then((data) => {
          this.setState({ cargando: false, dialogoExitoVisible: true });
        })
        .catch((error) => {
          this.setState({ cargando: false });
          Alert.alert('', error);
        });
    })
  }

  informarExito = () => {
    const { params } = this.props.navigation.state;

    this.setState({ dialogoExitoVisible: false }, () => {
      if (params.callback != undefined) {
        params.callback();
      }

      App.goBack();
    });
  }

  render() {
    const initData = global.initData;

    return (
      <View
        onLayout={this.buscarDatosPersonales}
        style={styles.contenedor}>

        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={this.cerrar} />

        {/* Contenido */}
        <View style={[styles.contenedor_Formulario, { backgroundColor: initData.backgroundColor }]}>
          <ScrollView
            keyboardShouldPersistTaps="always">

            <View style={styles.scrollViewContent}>

              {this.state.datosUsuario == undefined && this.state.cargando == true && (
                <Spinner color="green" />
              )}

              {this.state.datosUsuario != undefined && (

                <FormDatosPersonales
                  noValidar={true}
                  cargando={this.state.cargando}
                  datosIniciales={this.state.datosUsuario}
                  onAlgoInsertado={this.onFormularioDatosPersonalesAlgoInsertado}
                  onReady={this.onDatosPersonalesReady} />
              )}

            </View>
          </ScrollView>


          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

        {this.renderDialogoExito()}
        {this.renderDialogoConfirmarSalida()}

      </View >
    );
  }

  renderDialogoExito() {
    {/* Dialogo cambios version */ }
    return <Dialog
      dismissable={false}
      style={{ borderRadius: 16 }}
      visible={this.state.dialogoExitoVisible}
      onDismiss={this.ocultarDialogoExito}
    >
      <DialogContent>
        <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
          <Text>Usuario validado correctamente</Text>
        </ScrollView>
      </DialogContent>
      <DialogActions>
        <ButtonPeper onPress={this.informarExito}>Aceptar</ButtonPeper>
      </DialogActions>
    </Dialog>
  }

  renderDialogoConfirmarSalida() {
    {/* Dialogo cambios version */ }
    return <Dialog
      dismissable={false}
      style={{ borderRadius: 16 }}
      visible={this.state.dialogoConfirmarSalidaVisible}
      onDismiss={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}
    >
      <DialogContent>
        <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
          <Text>{texto_DialogoCancelarFormulario}</Text>
        </ScrollView>
      </DialogContent>
      <DialogActions>
        <ButtonPeper onPress={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}>No</ButtonPeper>
        <ButtonPeper onPress={() => {
          this.setState({
            dialogoConfirmarSalidaVisible: false
          }, () => {
            App.goBack();
          })
        }}>Si</ButtonPeper>
      </DialogActions>
    </Dialog>
  }
}


const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  contenedor_Formulario: {
    flex: 1
  },
  inputIconoError: {
    color: "red",
    fontSize: 32
  },
  scrollViewContent: {
    paddingBottom: 106,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  },
  textoTitulo: {
    fontSize: 32,
    marginLeft: 16
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
});

const texto_Titulo = 'Validar datos de Usuario';
const texto_DialogoCancelarFormulario = '¿Desea cancelar la validacion de su usuario?';
