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
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialIcons';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import IndicadorCargando from "@Utils/IndicadorCargando";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Nuevo Usuario",
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
      nombre: "",
      errorNombre: false,
      apellido: "",
      errorApellido: false,
      cargando: false
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

  onNombreChange(val) {
    this.setState({ nombre: val, errorNombre: val == "" });
  }

  onApellidoChange(val) {
    this.setState({ apellido: val, errorApellido: val == "" });
  }

  registrar() {
    let errorUsername = this.state.username == "";
    let errorPassword = this.state.password == "";
    let errorNombre = this.state.nombre == "";
    let errorApellido = this.state.apellido == "";

    this.setState({
      errorUsername: errorUsername,
      errorPassword: errorPassword,
      errorNombre: errorNombre,
      errorApellido: errorApellido
    });

    if (errorUsername || errorPassword || errorNombre || errorApellido) {
      Alert.alert(global.initData.nuevoUsuario.dialogoRevisarFormulario_Titulo || '', global.initData.nuevoUsuario.dialogoRevisarFormulario_Contenido || '');
      return;
    }

    this.setState({
      cargando: true
    }, () => {
      Rules_Usuario.crearUsuario({}).then(() => {
        Alert.alert('', 'Se creo correctamente su usuario. Por favor revise su casilla de correo para activarlo', [
          { text: 'Aceptar', onPress: () => { App.goBack() } }
        ]);
      }).catch(() => {
        Alert.alert('', 'Error procesando la solicitud');

        this.setState({
          cargando: false
        });
      });
    });
  }

  cerrar() {
    if (this.state.cargando) return;

    let tieneAlgo = this.state.username != "" || this.state.password != "" || this.state.nombre != "" || this.state.apellido != "";
    if (tieneAlgo) {
      Alert.alert(global.initData.nuevoUsuario.dialogoCancelarFormulario_Titulo || '', global.initData.nuevoUsuario.dialogoCancelarFormulario_Contenido || '', [
        { text: global.initData.nuevoUsuario.dialogoCancelarFormulario_OpcionSi || 'Si', onPress: () => App.goBack() },
        { text: global.initData.nuevoUsuario.dialogoCancelarFormulario_OpcionNo || 'No', onPress: () => { } },

      ]);
      return
    }

    App.goBack();
  }

  render() {
    const initData = global.initData.nuevoUsuario;

    return (
      <View style={initData.styles.contenedor}>

        {/* StatusBar */}
        <StatusBar backgroundColor={initData.statusBar_BackgroundColor} barStyle={initData.statusBar_Style} />

        {/* Encabezado */}
        <View style={[initData.styles.contenedor_Encabezado, {
          paddingTop: Platform.OS == 'ios' ? 24 : 0
        }]}>
          <TouchableOpacity onPress={() => { this.cerrar(); }}>
            <View style={initData.styles.botonCerrar}>
              <Icon style={initData.styles.botonCerrarIcono} type={initData.botonCerrar_IconoFamily} name={initData.botonCerrar_Icono} />
            </View>
          </TouchableOpacity>
          <Text style={initData.styles.textoTitulo}>{initData.titulo_Texto}</Text>
        </View>

        {/* Contenido */}
        <View style={initData.styles.contenedor_Formulario}>
          <ScrollView >

            <View style={initData.styles.scrollViewContent}>
              <Item error={this.state.errorUsername}>
                <Input placeholder={initData.inputUsername_Placeholder} value={this.state.username} onChangeText={(val) => { this.onUsernameChange(val) }} />
                {this.state.errorUsername == true && (
                  <Icon type={initData.input_IconoErrorFamily} name={initData.input_IconoError} style={initData.styles.inputIconoError} />
                )}
              </Item>

              <Item error={this.state.errorPassword}>
                <Input placeholder={initData.inputPassword_Placeholder} value={this.state.password} onChangeText={(val) => { this.onPasswordChange(val) }} />
                {this.state.errorPassword == true && (
                  <Icon type={initData.input_IconoErrorFamily} name={initData.input_IconoError} style={initData.styles.inputIconoError} />
                )}
              </Item>


              <Item error={this.state.errorNombre}>
                <Input placeholder={initData.inputNombre_Placeholder} value={this.state.nombre} onChangeText={(val) => { this.onNombreChange(val) }} />
                {this.state.errorNombre == true && (
                  <Icon type={initData.input_IconoErrorFamily} name={initData.input_IconoError} style={initData.styles.inputIconoError} />
                )}
              </Item>

              <Item error={this.state.errorApellido}>
                <Input placeholder={initData.inputApellido_Placeholder} value={this.state.apellido} onChangeText={(val) => { this.onApellidoChange(val) }} />
                {this.state.errorApellido == true && (
                  <Icon type={initData.input_IconoErrorFamily} name={initData.input_IconoError} style={initData.styles.inputIconoError} />
                )}
              </Item>



            </View>

          </ScrollView>

          {/* Boton Registrar */}
          <Button full style={initData.styles.botonRegistrar} onPress={() => { this.registrar() }}>
            <Text>{initData.botonRegistrar_Texto}</Text>
          </Button>

          {/* Cargando */}
          <IndicadorCargando visible={this.state.cargando} style={initData.styles.contenedor_Cargando} />
        </View>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View>
    );
  }
}
