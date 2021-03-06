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
  Spinner
} from "native-base";
import {
  Card,
  CardContent
} from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';
import MiCardDetalle from '@Utils/MiCardDetalle';
import MiInputTextValidar from '@Utils/MiInputTextValidar';
import MiDialogo from '@Utils/MiDialogo';

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class UsuarioEditarDatosContacto extends React.Component {

  static navigationOptions = {
    title: "Editar datos de contacto",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      datosUsuario: undefined,
      email: undefined,
      emailError: false,
      telefonoFijoCaracteristica: undefined,
      telefonoFijoCaracteristicaError: false,
      telefonoFijoNumero: undefined,
      telefonoFijoNumeroError: false,
      telefonoCelularCaracteristica: undefined,
      telefonoCelularCaracteristicaError: false,
      telefonoCelularNumero: undefined,
      telefonoCelularNumeroError: false,
      cargando: false,
      dialogoExitoVisible: false
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {
    this.buscarDatos();
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

  buscarDatos = () => {
    Rules_Usuario.getDatos()
      .then((datos) => {

        let telFijoArea = undefined;
        let telFijoNumero = undefined;
        let celArea = undefined;
        let celNumero = undefined;

        if (datos.telefonoFijo != undefined) {
          if (datos.telefonoFijo.split('-').length >= 2) {
            telFijoArea = datos.telefonoFijo.split('-')[0];
            telFijoNumero = datos.telefonoFijo.split('-')[1];
          } else {
            telFijoNumero = datos.telefonoFijo;
          }
        }

        if (datos.telefonoCelular != undefined) {
          if (datos.telefonoCelular.split('-').length >= 2) {
            celArea = datos.telefonoCelular.split('-')[0];
            celNumero = datos.telefonoCelular.split('-')[1];
          } else {
            celNumero = datos.telefonoCelular;
          }
        }

        this.setState({
          datosUsuario: datos,
          email: datos.email,
          telefonoFijoCaracteristica: telFijoArea,
          telefonoFijoNumero: telFijoNumero,
          telefonoCelularCaracteristica: celArea,
          telefonoCelularNumero: celNumero
        });
      })
      .catch((error) => {
        this.setState({
          cargando: false,
          error: error
        });
      });
  }

  guardarCambios = () => {

    const algunError =
      this.state.emailError == true ||
      this.state.telefonoFijoCaracteristicaError == true ||
      this.state.telefonoFijoNumeroError == true ||
      this.state.telefonoCelularCaracteristicaError == true ||
      this.state.telefonoCelularNumeroError == true;
    if (algunError == true) {
      Alert.alert('', 'Revise el formulario');
      return;
    }

    const email = this.state.email;

    if (email == undefined || email == "") {
      Alert.alert('', 'Ingrese el e-mail', [
        {
          text: 'Aceptar',
          onPress: () => {
            this.inputEmail._root.focus();
          }
        }
      ]);
      return;
    }

    //Telefono celular
    let telefonoCelularCaracteristica = this.state.telefonoCelularCaracteristica;
    if (telefonoCelularCaracteristica == "") telefonoCelularCaracteristica = undefined;

    let telefonoCelularNumero = this.state.telefonoCelularNumero;
    if (telefonoCelularNumero == "") telefonoCelularNumero = undefined;

    if ((telefonoCelularCaracteristica != undefined) != (telefonoCelularNumero != undefined)) {
      Alert.alert('', 'Complete el telefono celular', [
        {
          text: 'Aceptar',
          onPress: () => {
            // this.inputEmail._root.focus();
          }
        }
      ]);
      return;
    }

    //Telefono fijo
    let telefonoFijoCaracteristica = this.state.telefonoFijoCaracteristica;
    if (telefonoFijoCaracteristica == "") telefonoFijoCaracteristica = undefined;

    let telefonoFijoNumero = this.state.telefonoFijoNumero;
    if (telefonoFijoNumero == "") telefonoFijoNumero = undefined;

    if ((telefonoFijoCaracteristica != undefined) != (telefonoFijoNumero != undefined)) {
      Alert.alert('', 'Complete el telefono fijo', [
        {
          text: 'Aceptar',
          onPress: () => {
            // this.inputEmail._root.focus();
          }
        }
      ]);
      return;
    }

    Keyboard.dismiss();
    this.setState({ cargando: true }, () => {
      const comando = {
        email: this.state.email
      };

      if (telefonoFijoCaracteristica != undefined) {
        comando.telefonoFijo = telefonoFijoCaracteristica + '-' + telefonoFijoNumero;
      }
      if (telefonoCelularCaracteristica != undefined) {
        comando.telefonoCelular = telefonoCelularCaracteristica + '-' + telefonoCelularNumero;
      }

      Rules_Usuario.actualizarDatosContacto(comando)
        .then(() => {
          this.setState({
            cargando: false,
            dialogoExitoVisible: true
          });
        })
        .catch((error) => {
          Alert.alert('', error || 'Error procesando la solicitud');
          this.setState({ cargando: false });
        })
    });
  }

  informarExito = () => {
    const { params } = this.props.navigation.state;
    if (params != undefined && params.callback != undefined) {
      params.callback();
    }

    this.setState({
      dialogoExitoVisible: false
    }, () => {
      App.goBack();
    });
  }

  cerrar = () => {
    if (this.state.cargando == true) return;
    App.goBack();
  }

  onEmailRef = (ref) => {
    this.inputEmail = ref;
  }

  onEmailChange = (val) => {
    this.setState({ email: val });
  }

  onEmailError = (error) => {
    this.setState({ emailError: error });
  }

  onTelFijoCaracteristicaRef = (ref) => {
    this.inputTelefonoFijoCaracteristica = ref;
  }

  onTelFijoCatacteristicaChange = (val) => {
    this.setState({ telefonoFijoCaracteristica: val });
  }

  onTelFijoCatacteristicaError = (error) => {
    this.setState({ telefonoFijoCaracteristicaError: error });
  }

  onTelFijoNumeroRef = (ref) => {
    this.inputTelefonoFijoNumero = ref;
  }

  onTelFijoNumeroChange = (val) => {
    this.setState({ telefonoFijoNumero: val });
  }

  onTelFijoNumeroError = (error) => {
    this.setState({ telefonoFijoNumeroError: error });
  }

  onCelularCaracteristicaRef = (ref) => {
    this.inputTelefonoCelularCaracteristica = ref;
  }

  onCelularCatacteristicaChange = (val) => {
    this.setState({ telefonoCelularCaracteristica: val });
  }

  onCelularCatacteristicaError = (error) => {
    this.setState({ telefonoCelularCaracteristicaError: error });
  }

  onCelularNumeroRef = (ref) => {
    this.inputTelefonoCelularNumero = ref;
  }

  onCelularNumeroChange = (val) => {
    this.setState({ telefonoCelularNumero: val });
  }

  onCelularNumeroError = (error) => {
    this.setState({ telefonoCelularNumeroError: error });
  }

  ocultarTeclado = () => {
    Keyboard.dismiss();
  }

  render() {
    const initData = global.initData;

    return (
      <View style={styles.contenedor}>

        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo='Editar datos de contacto' onBackPress={this.cerrar} />

        {/* Contenido */}
        <View style={[styles.contenedor_Contenido, { backgroundColor: initData.backgroundColor }]}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.scrollViewContent}>

              {this.renderCard()}

            </View>
          </ScrollView>

          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        {/* DialogoExito */}
        {this.renderDialogoExito()}
      </View >
    );
  }

  renderCard() {
    if (this.state.datosUsuario == undefined) {
      return <Spinner color="green" />
    }

    let botones = [];
    botones.push({
      disabled: this.state.cargando == true,
      texto: 'Guardar cambios',
      onPress: this.guardarCambios
    })

    return <View>
      <MiCardDetalle botones={botones}>
        {this.renderContent()}
        {this.renderCargando()}
      </MiCardDetalle>

    </View>;

  }

  renderCargando() {
    let visible = this.state.cargando == true;

    return <View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        opacity: visible ? 1 : 0,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Spinner color="green" />
      <Text>Guardando cambios</Text>
    </View>;
  }

  renderContent() {

    return <View>


      <View style={{ display: 'flex', flexDirection: 'row' }}>

        <Icon name="email" style={{ fontSize: 24, marginTop: 16, marginRight: 8, marginLeft: 8 }} />

        <MiInputTextValidar
          onRef={this.onEmailRef}
          valorInicial={this.state.email}
          placeholder='E-mail...'
          keyboardType="email-address"
          returnKeyType="done"
          autoCorrect={false}
          onSubmitEditing={this.ocultarTeclado}
          validaciones={{ requerido: true, minLength: 4, maxLength: 50, tipo: 'email' }}
          onChange={this.onEmailChange}
          onError={this.onEmailError}
          style={{ flex: 1 }}
        />
      </View>

      <Text style={{ marginLeft: 6, marginTop: 16, fontWeight: 'bold' }}>Teléfono celular</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>

        <Icon name="phone" style={{ fontSize: 24, marginTop: 16, marginRight: 8, marginLeft: 8 }} />

        <MiInputTextValidar
          onRef={this.onCelularCaracteristicaRef}
          valorInicial={this.state.telefonoCelularCaracteristica}
          placeholder='Área'
          returnKeyType="done"
          keyboardType="numeric"
          autoCorrect={false}
          onSubmitEditing={this.ocultarTeclado}
          style={{ minWidth: 70, maxWidth: 70, marginRight: 16 }}
          validaciones={{
            minLength: 2,
            maxLength: 5,
            tipo: 'numeroEntero',
            mensajes: mensajesTelCaracteristica
          }}
          onChange={this.onCelularCatacteristicaChange}
          onError={this.onCelularCatacteristicaError}
        />

        <Text style={{ marginTop: 16, marginRight: 8 }}>15</Text>
        <MiInputTextValidar
          onRef={this.onCelularNumeroRef}
          valorInicial={this.state.telefonoCelularNumero}
          placeholder='Número'
          keyboardType="numeric"
          returnKeyType="done"
          autoCorrect={false}
          onSubmitEditing={this.ocultarTeclado}
          style={{ flex: 1 }}
          validaciones={{
            minLength: 5,
            maxLength: 12,
            tipo: 'numeroEntero',
            mensajes: mensajesTelNumero
          }}
          onChange={this.onCelularNumeroChange}
          onError={this.onCelularNumeroError}
        />
      </View>


      <Text style={{ marginLeft: 6, marginTop: 16, fontWeight: 'bold' }}>Teléfono fijo</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>

        <Icon name="phone" style={{ fontSize: 24, marginTop: 16, marginRight: 8, marginLeft: 8 }} />

        <MiInputTextValidar
          onRef={this.onTelFijoCaracteristicaRef}
          valorInicial={this.state.telefonoFijoCaracteristica}
          placeholder='Área'
          keyboardType="numeric"
          returnKeyType="done"
          autoCorrect={false}
          onSubmitEditing={this.ocultarTeclado}
          style={{ minWidth: 60, maxWidth: 60, marginRight: 16 }}
          validaciones={{
            minLength: 2,
            maxLength: 5,
            tipo: 'numeroEntero',
            mensajes: mensajesTelCaracteristica
          }}
          onChange={this.onTelFijoCatacteristicaChange}
          onError={this.onTelFijoCatacteristicaError}
        />

        <MiInputTextValidar
          onRef={this.onTelFijoNumeroRef}
          valorInicial={this.state.telefonoFijoNumero}
          placeholder='Número'
          keyboardType="numeric"
          returnKeyType="done"
          autoCorrect={false}
          onSubmitEditing={this.ocultarTeclado}
          style={{ flex: 1 }}
          validaciones={{
            minLength: 5,
            maxLength: 12,
            tipo: 'numeroEntero',
            mensajes: mensajesTelNumero
          }}
          onChange={this.onTelFijoNumeroChange}
          onError={this.onTelFijoNumeroError}
        />
      </View>
    </View>;
  }

  renderDialogoExito() {
    return <MiDialogo
      titulo="Usuario atualizado correctamente"
      visible={this.state.dialogoExitoVisible == true}
      cancelable={false}
      botones={[
        {
          texto: 'Aceptar',
          onPress: this.informarExito
        }
      ]}
    >
      <Text>Datos de contacto editados correctamente</Text>
    </MiDialogo>
  }
}


const mensajesTelCaracteristica = {
  minLength: function () { return '*' },
  maxLength: function () { return '*' },
  tipo: '*'
};

const mensajesTelNumero = {
  minLength: function () { return 'Muy corto' },
  maxLength: function () { return 'Muy largo' },
  tipo: 'Número inválido'
};

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  contenedor_Contenido: {
    flex: 1
  },
  scrollViewContent: {
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  },
  botonRegistrar: {
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    alignSelf: 'center',
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  }
});
