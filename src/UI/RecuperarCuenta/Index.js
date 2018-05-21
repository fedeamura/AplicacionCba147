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
import { Card, CardContent } from "react-native-paper";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialIcons';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import IndicadorCargando from "@Utils/IndicadorCargando";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Index extends React.Component {
  static navigationOptions = {
    title: "Recuperar cuenta",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      errorEmail: false,
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

  onEmailChange(val) {
    this.setState({ email: val, errorEmail: val == "" });
  }

  recuperar() {
    let errorEmail = this.state.email == "";
    let error = errorEmail;

    this.setState({
      errorEmail: errorEmail
    });

    if (error) {
      Alert.alert(global.initData.recuperarCuenta.dialogoRevisarFormulario_Titulo || '', global.initData.recuperarCuenta.dialogoRevisarFormulario_Contenido || '');
      return;
    }

    this.setState({
      cargando: true
    }, () => {
      Rules_Usuario.getUsuariosConEmail(this.state.email).then((usernames) => {

        //Si no hay nada
        if (usernames.length == 0) {
          Alert.alert('', 'No hay ningun usuario asociado a la dirección de e-mail indicada');
          this.setState({
            usernames: undefined,
            cargando: false
          });
          return;
        }

        //Si hay uno solo
        if (usernames.length == 1) {
          this.recuperarParaUsername(this.state.email, usernames[0]);
          return;
        }

        //Si hay muchos
        this.setState({
          usernames: usernames,
          cargando: false
        });

      }).catch(() => {
        Alert.alert('', 'Error procesando la solicitud');

        this.setState({
          cargando: false
        });
      });
    });
  }

  recuperarParaUsername(username) {
    this.setState({
      cargando: true
    }, () => {
      Rules_Usuario.recuperarCuenta(this.state.email, username)
        .then(() => {
          Alert.alert('', 'Se ha enviado un e-mail a su casilla de correo para recuperar la cuenta');
          App.goBack();
        })
        .catch(() => {
          Alert.alert('', 'Error procesando la solicitud');
          this.setState({
            usernames: undefined,
            cargando: false
          });
        });
    });
  }

  cambiarEmail() {
    this.setState({
      usernames: undefined,
      cargando: false,
      email: ''
    });
  }

  cerrar() {
    if (this.state.cargando) return;

    let tieneAlgo = this.state.email != "";
    if (tieneAlgo) {
      Alert.alert(global.initData.recuperarCuenta.dialogoCancelarFormulario_Titulo || '', global.initData.recuperarCuenta.dialogoCancelarFormulario_Contenido || '', [
        { text: global.initData.recuperarCuenta.dialogoCancelarFormulario_OpcionSi || 'Si', onPress: () => App.goBack() },
        { text: global.initData.recuperarCuenta.dialogoCancelarFormulario_OpcionNo || 'No', onPress: () => { } },

      ]);
      return
    }

    App.goBack();
  }

  render() {
    const initData = global.initData.recuperarCuenta;

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

              {/* Email */}
              <Item error={this.state.errorEmail}>
                <Input
                  style={initData.styles.inputEmail}
                  disabled={this.state.usernames != undefined && this.state.usernames.lenght != 0}
                  placeholder={initData.inputEmail_Placeholder}
                  value={this.state.email}
                  onChangeText={(val) => { this.onEmailChange(val) }} />
                {this.state.errorEmail == true && (
                  <Icon type={initData.input_IconoErrorFamily} name={initData.input_IconoError} style={initData.styles.inputIconoError} />
                )}
              </Item>


              {/* Usernames */}
              {this.state.usernames != undefined && this.state.usernames.length != 0 && (
                <View>
                  <Text style={initData.styles.textoUsernames}>{initData.textoUsernamesEncontrados_Texto}</Text>
                  <Text style={initData.styles.textoUsernamesSeleccioneUno}>{initData.textoUsernamesEncontrados_TextoSeleccioneUno}</Text>
                  {this.state.usernames.map((username) => {
                    return <Card style={initData.styles.cardUsername} onPress={() => {
                      this.recuperarParaUsername(username);
                    }}>
                      <CardContent>
                        <Text style={initData.styles.textoUsername}>{username}</Text>
                      </CardContent>
                    </Card>
                  })}
                  {/* <Button onPress={() => { this.cambiarEmail() }}><Text>Cambiar e-mail</Text></Button> */}
                </View>


              )}

            </View>

          </ScrollView>

          {/* Boton Recuperar */}
          {(this.state.usernames == undefined || this.state.usernames.length == 0) && (
            <Button full style={initData.styles.botonRecuperar} onPress={() => { this.recuperar() }}>
              <Text>{initData.botonRecuperar_Texto}</Text>
            </Button>
          )}

          {/* Cargando */}
          <IndicadorCargando visible={this.state.cargando} style={initData.styles.contenedor_Cargando} />
        </View>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View>
    );
  }
}
