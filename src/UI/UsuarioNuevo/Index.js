import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Item,
  Spinner,
  Content
} from "native-base";
import { Card, CardContent, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

//Mis componentes
import App from "Cordoba/src/UI/App";
import IndicadorCargando from "@Utils/IndicadorCargando";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";


const texto_Titulo = "Nuevo Usuario";
const texto_ErrorGenerico = "Error procesando la solicitud";
const texto_ErrorCompletarFormulario = "Revise el formulario";

export default class Login extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      errorUsername: false,
      password: "",
      errorPassword: false,
      repeatPassword: "",
      errorRepeatPassword: false,
      nombre: "",
      errorNombre: false,
      apellido: "",
      errorApellido: false,
      dni: "",
      errorDni: false,
      fechaNacimiento: "",
      errorFechaNacimiento: false,
      sexo: "",
      errorSexo: false,
      telefono: "",
      errorTelefono: false,
      email: "",
      errorEmail: false,
      mostrarPanelResultado: false,
      cargando: false,
      error: undefined,
      animRegistrar: new Animated.Value(0)
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

  onUsernameChange(val) {
    this.setState({ username: val, errorUsername: val == "" });
  }

  onPasswordChange(val) {
    this.setState({ password: val, errorPassword: val == "" });
  }

  onRepeatPasswordChange(val) {
    this.setState({ repeatPassword: val, errorRepeatPassword: val == "" || val != this.state.password });
  }

  onNombreChange(val) {
    this.setState({ nombre: val, errorNombre: val == "" });
  }

  onApellidoChange(val) {
    this.setState({ apellido: val, errorApellido: val == "" });
  }

  onDniChange(val) {
    this.setState({ dni: val, errorDni: val == "" });
  }

  onFechaNacimientoChange(val) {
    this.setState({ fechaNacimiento: val, errorFechaNacimiento: val == "" });
  }

  onSexoChange(val) {
    this.setState({ sexo: val, errorSexo: val == "" });
  }

  onTelefonoChange(val) {
    this.setState({ telefono: val, errorTelefono: val == "" });
  }

  onEmailChange(val) {
    this.setState({ email: val, errorEmail: val == "" });
  }

  registrar() {
    let errorUsername = this.state.username == "";
    let errorPassword = this.state.password == "";
    let errorRepeatPassword = this.state.repeatPassword == "" || this.state.repeatPassword != this.state.password;
    let errorNombre = this.state.nombre == "";
    let errorApellido = this.state.apellido == "";
    let errorDni = this.state.dni == "";
    let errorSexo = this.state.sexo == "";
    let errorFechaNacimiento = this.state.fechaNacimiento == "";
    let errorTelefono = this.state.telefono == "";
    let errorEmail = this.state.email == "";


    this.setState({
      errorUsername: errorUsername,
      errorPassword: errorPassword,
      errorRepeatPassword: errorRepeatPassword,
      errorNombre: errorNombre,
      errorApellido: errorApellido,
      errorDni: errorDni,
      errorSexo: errorSexo,
      errorFechaNacimiento: errorFechaNacimiento,
      errorEmail: errorEmail,
      errorTelefono: errorTelefono
    });

    if (this.state.password != "" && this.state.repeatPassword != "" && this.state.password != this.state.repeatPassword) {
      Alert.alert('', 'Las contraseñas no coinciden');
      return;
    }

    if (errorUsername || errorPassword || errorRepeatPassword || errorNombre || errorApellido || errorDni || errorSexo || errorFechaNacimiento || errorEmail || errorTelefono) {
      Alert.alert('', texto_ErrorCompletarFormulario);
      return;
    }

    let anim;

    this.setState({
      mostrarPanelResultado: true,
      cargando: true
    }, () => {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(this.state.animRegistrar, {
            toValue: 0.5,
            duration: 1000
          }),
          Animated.timing(this.state.animRegistrar, {
            toValue: 0,
            duration: 1000
          })
        ]));
      anim.start();

      Rules_Usuario.crearUsuario({}).then(() => {
        anim.stop();
        Animated.timing(this.state.animRegistrar, {
          toValue: 1,
          duration: 1500
        }).start();

        this.setState({
          cargando: false
        });
      }).catch((error) => {
        Alert.alert('', error);
        this.setState({
          mostrarPanelResultado: false,
          cargando: false
        });
      });
    });
  }

  cerrar() {
    if (this.state.cargando == true) return;

    let tieneAlgo =
      this.state.username != "" ||
      this.state.password != "" ||
      this.state.nombre != "" ||
      this.state.apellido != "" ||
      this.state.repeatPassword != "" ||
      this.state.sexo != "" ||
      this.state.dni != "" ||
      this.state.fechaNacimiento != "" ||
      this.state.telefono != "" ||
      this.state.email != ""
      ;

    if (tieneAlgo) {
      Alert.alert('', '¿Esta seguro que desea cancelar la creación de un nuevo usuario?', [
        { text: 'Si', onPress: () => App.goBack() },
        { text: 'No', onPress: () => { } },
      ]);
      return
    }

    App.goBack();
  }

  render() {

    const initData = global.initData.nuevoUsuario;
    const backgroundColor_StatusBar = Platform.OS == 'ios' ? 'transparent' : 'white';
    const iconoError = "error";
    const iconoErrorFontFamily = "MaterialIcons";

    return (
      <View style={styles.contenedor}>

        {/* StatusBar */}
        <StatusBar backgroundColor={backgroundColor_StatusBar} barStyle="dark-content" />

        <Toolbar style={{ backgroundColor: 'white', elevation: 0 }} elevation={0} dark={false}>
          <ToolbarBackAction
            onPress={() => {
              this.cerrar();
            }}
          />
          <ToolbarContent title={texto_Titulo} />
        </Toolbar>

        {/* Contenido */}
        <View style={styles.contenedor_Formulario}>
          <ScrollView >

            <View style={styles.scrollViewContent}>

              {/* Datos de acceso */}
              <Text style={{ fontSize: 24, marginLeft: 8, marginBottom: 8, marginTop: 32 }}>Datos de acceso</Text>
              <Card style={{ padding: 8 }}>

                {/* Username */}
                <Item error={this.state.errorUsername}>
                  <Input placeholder={"Usuario"} value={this.state.username} onChangeText={(val) => { this.onUsernameChange(val) }} />
                  {this.state.errorUsername == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Password */}
                <Item error={this.state.errorPassword}>
                  <Input placeholder={"Contraseña"} value={this.state.password} onChangeText={(val) => { this.onPasswordChange(val) }} />
                  {this.state.errorPassword == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Repeat Password */}
                <Item error={this.state.errorRepeatPassword}>
                  <Input placeholder={"Repita la contraseña"} value={this.state.repeatPassword} onChangeText={(val) => { this.onRepeatPasswordChange(val) }} />
                  {this.state.errorRepeatPassword == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>
              </Card>

              {/* Datos personas */}
              <Text style={{ fontSize: 24, marginLeft: 8, marginBottom: 8, marginTop: 32 }}>Datos personales</Text>
              <Card style={{ padding: 8 }}>
                {/* Nombre */}
                <Item error={this.state.errorNombre}>
                  <Input placeholder="Nombre" value={this.state.nombre} onChangeText={(val) => { this.onNombreChange(val) }} />
                  {this.state.errorNombre == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Apellido */}
                <Item error={this.state.errorApellido}>
                  <Input placeholder="Apellido" value={this.state.apellido} onChangeText={(val) => { this.onApellidoChange(val) }} />
                  {this.state.errorApellido == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Sexo */}
                <Item error={this.state.errorSexo}>
                  <Input placeholder="Sexo" value={this.state.sexo} onChangeText={(val) => { this.onSexoChange(val) }} />
                  {this.state.errorSexo == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Fecha de nacimiento */}
                <Item error={this.state.errorFechaNacimiento}>
                  <Input placeholder="Fecha de nacimiento" value={this.state.fechaNacimiento} onChangeText={(val) => { this.onFechaNacimientoChange(val) }} />
                  {this.state.errorFechaNacimiento == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Dni */}
                <Item error={this.state.errorDni}>
                  <Input placeholder="Nº de Documento" value={this.state.dni} onChangeText={(val) => { this.onDniChange(val) }} />
                  {this.state.errorDni == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

              </Card>

              {/* Datos de contacto */}
              <Text style={{ fontSize: 24, marginLeft: 8, marginBottom: 8, marginTop: 32 }}>Datos de contacto</Text>
              <Card style={{ padding: 8 }}>

                {/* E-Mail */}
                <Item error={this.state.errorEmail}>
                  <Input placeholder={"E-Mail"} value={this.state.email} onChangeText={(val) => { this.onEmailChange(val) }} />
                  {this.state.errorEmail == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>

                {/* Telefono */}
                <Item error={this.state.errorTelefono}>
                  <Input placeholder={"Teléfono"} value={this.state.telefono} onChangeText={(val) => { this.onTelefonoChange(val) }} />
                  {this.state.errorTelefono == true && (
                    <Icon type={iconoErrorFontFamily} name={iconoError} style={styles.inputIconoError} />
                  )}
                </Item>


              </Card>

            </View>

          </ScrollView>

          {/* Boton Registrar */}
          <Button full style={styles.botonRegistrar} onPress={() => { this.registrar() }}>
            <Text>Crear usuario</Text>
          </Button>


          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

        {/* Panel resultado */}
        {this.state.mostrarPanelResultado == true && (
          <View style={styles.contenedor_Resultado}>

            <View style={styles.animacion_Resultado}>
              <LottieView
                style={{ width: '100%', height: '100%' }}
                resizeMode='contain'
                source={require('@Resources/animacion_exito.json')}
                progress={this.state.animRegistrar} />
            </View>

            {this.state.cargando == true && (
              <Text style={styles.texto_CreandoUsuario}>Registrando su usuario...</Text>
            )}

            {this.state.cargando == false && (
              <View>
                <Text style={styles.texto_CreandoUsuario}>Se creo correctamente tu usuario</Text>
                <Text style={styles.texto_EmailActivacion}>Te enviamos un e-mail a {this.state.email} con las instrucciones para activarlo</Text>

                <View style={{ marginTop: 16 }}>

                  <Button
                    bordered
                    rounded
                    style={{ alignSelf: 'center', borderColor: 'green' }}
                    onPress={() => {
                      App.goBack();
                    }}><Text style={{ color: 'green' }}>Aceptar</Text></Button>
                </View>

              </View>
            )}

          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  botonRegistrar: {
    alignSelf: "center",
    backgroundColor: "green",
    borderRadius: 32,
    bottom: 0,
    margin: 16,
    position: "absolute",
    shadowOpacity: 0.4,
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  },
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  contenedor_Formulario: {
    backgroundColor: "rgba(230,230,230,1)",
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
  contenedor_Resultado: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center'
  },
  animacion_Resultado: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  texto_CreandoUsuario: {
    fontSize: 24,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  },
  texto_EmailActivacion: {
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  }
});
