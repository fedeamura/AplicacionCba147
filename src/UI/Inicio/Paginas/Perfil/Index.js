import React from "react";
import {
  View,
  Animated,
  ScrollView,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import {
  Text, Spinner, Button
} from "native-base";

import WebImage from 'react-native-web-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

//Mis componentes
import App from "@UI/App";
import MiCardDetalle from '@Utils/MiCardDetalle';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiPanelError from "@Utils/MiPanelError";
import MiDialogo from "@Utils/MiDialogo";
import MiInputTextValidar from "@Utils/MiInputTextValidar";

//Rules
import Rules_Usuario from '@Rules/Rules_Usuario';

export default class PaginaPerfil extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      datos: undefined,
      error: undefined,
      //Username
      dialogoUsernameVisible: false,
      usernameNuevo: undefined,
      usernameNuevoError: true,
      cargandoCambioUsername: false,
      //Password
      dialogoPasswordVisible: false,
      passwordAnterior: undefined,
      passwordAnteriorError: true,
      passwordNueva: undefined,
      passwordNuevaError: true,
      cargandoCambioPassword: false,
      keyboardHeight: 0
    };

    this.animCargando = new Animated.Value(1);
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

  componentDidMount() {
    this.buscarDatos();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.cargando != this.state.cargando) {
      Animated.timing(this.animCargando, { toValue: nextState.cargando ? 1 : 0, duration: 300 }).start();
    }
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 1,
    }).start();

    this.setState({ keyboardHeight: event.endCoordinates.height });
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  buscarDatos = () => {

    Animated.timing(this.animCargando, { toValue: 1, duration: 300 }).start(() => {
      this.setState({ cargando: true }, () => {
        Rules_Usuario.getDatos()
          .then((datos) => {
            this.setState({
              cargando: false,
              datos: datos
            });
          })
          .catch((error) => {
            this.setState({
              cargando: false,
              error: error
            });
          });
      });
    });
  }

  onBtnCambiarUsernameClick = () => {
    this.setState({
      dialogoUsernameVisible: true,
      usernameNuevo: undefined,
      usernameNuevoError: true,
      cargandoCambioUsername: false
    });
  }

  cambiarUsername = () => {
    this.setState({ cargandoCambioUsername: true }, () => {
      Rules_Usuario.cambiarUsername(this.state.usernameNuevo)
        .then(() => {
          this.setState({
            dialogoUsernameVisible: false
          }, () => {
            setTimeout(() => {

              //Mando a buscar de nuevo
              this.buscarDatos();

              //Informo
              Snackbar.show({
                title: 'Nombre de usuario cambiado correctamente'
              });

            }, 300);
          });
        })
        .catch((error) => {
          this.setState({ cargandoCambioUsername: false });
          Snackbar.show({ title: 'Error procesando la solicitud' });
        });
    });
  }

  onBtnCambiarPasswordClick = () => {
    this.setState({
      dialogoPasswordVisible: true,
      passwordAnterior: undefined,
      passwordAnteriorError: true,
      passwordNueva: undefined,
      passwordNuevaError: true,
      cargandoCambioPassword: false
    });
  }

  cambiarPassword = () => {
    this.setState({
      cargandoCambioPassword: true
    }, () => {
      Rules_Usuario.cambiarPassword(this.state.passwordAnterior, this.state.passwordNueva)
        .then(() => {
          this.setState({
            dialogoPasswordVisible: false
          }, () => {
            //Informo
            Snackbar.show({ title: 'Contraseña cambiada correctamente' });
          });
        })
        .catch((error) => {
          this.setState({
            cargandoCambioPassword: false
          });

          //Informo
          Snackbar.show({ title: error || 'Error procesando la solicitud' });
        });
    });
  }

  onBtnEditarDatosContactoClick = () => {
    App.navegar('UsuarioEditarDatosContacto', {
      callback: () => {
        this.buscarDatos()
      }
    });
  }

  cambiarFotoPerfil = () => {
    Alert.alert('', 'Cambiar foto de perfil', [
      { text: 'Cancelar', onPress: () => { } },
      { text: 'Galeria', onPress: this.cambiarFotoPerfilDesdeGaleria },
      { text: 'Cámara', onPress: this.cambiarFotoPerfilDesdeCamara },
    ], { cancelable: true });
  }

  cambiarFotoPerfilDesdeCamara = () => {
    var options = {
      title: 'Elegir foto'
    };

    this.setState({
      cargandoFoto: true
    }, () => {
      // Mando a buscar la foto
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
          this.setState({
            cargandoFoto: false
          });
          return;
        }

        if (response.error) {
          this.setState({
            cargandoFoto: false
          });

          Alert.alert('', 'Error procesando la solicitud. Error: ' + response.error);
          return;
        }

        this.procesarImagenPerfil(response.uri);
      });
    });
  }

  cambiarFotoPerfilDesdeGaleria = () => {
    var options = {
      title: 'Elegir foto'
    };

    this.setState({
      cargandoFoto: true
    }, () => {
      // Mando a buscar la foto
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          this.setState({
            cargandoFoto: false
          });
          return;
        }

        if (response.error) {
          this.setState({
            cargandoFoto: false
          });

          Alert.alert('', 'Error procesando la solicitud');
          return;
        }

        this.procesarImagenPerfil(response.uri);
      });
    });
  }

  procesarImagenPerfil = (img) => {
    // Achico la imagen
    ImageResizer.createResizedImage(img, 1000, 1000, 'JPEG', 80)
      .then((responseResize) => {
        // Convierto la imagen a base64
        RNFS.readFile(responseResize.uri, 'base64')
          .then(function (base64) {
            let foto = 'data:image/jpeg;base64,' + base64;

            Rules_Usuario.cambiarFoto(foto)
              .then((identificador) => {
                this.setState({
                  cargandoFoto: false
                }, () => {
                  this.buscarDatos();
                });

                //Informo
                Snackbar.show({ title: 'Imagen de perfil actualizada correctamente' });
              })
              .catch((error) => {
                this.setState({ cargandoFoto: false });
                Alert.alert('', error || 'Error procesando la solicitud');
              });
          }.bind(this))
          .catch(() => {
            Alert.alert('', 'Error procesando la solicitud');
            this.setState({
              cargandoFoto: false
            });
          });
      })
      .catch((err) => {
        Alert.alert('', 'Error procesando la solicitud');
        this.setState({
          cargandoFoto: false
        });
      });
  }

  render() {
    const initData = global.initData;

    return <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

      {this.renderContent()}
      {this.renderCargando()}

    </View >
  }

  renderCargando() {
    const initData = global.initData;

    return (
      <Animated.View
        pointerEvents={this.cargando == true ? 'auto' : 'none'}
        style={[styles.contenedor, { backgroundColor: initData.backgroundColor }, {
          position: 'absolute',
          opacity: this.animCargando
        }]}>
        <Spinner color="green" />
      </Animated.View >
    );

  }

  renderContent() {
    const initData = global.initData;

    if (this.state.error != undefined) {
      return <MiPanelError
        icono="alert-circle-outline"
        mostrarBoton={true}
        textoBoton="Reintentar"
        onBotonPress={this.buscarDatos}
        detalle={this.state.error} />;
    }

    if (this.state.datos == undefined) return null;

    let urlFoto;
    if (this.state.datos.identificadorFotoPersonal != undefined) {
      urlFoto = initData.urlCordobaFiles + '/' + this.state.datos.identificadorFotoPersonal + '/3';
    } else {
      urlFoto = this.state.datos.sexoMasculino ? initData.urlPlaceholderUserMale : initData.urlPlaceholderUserFemale;
    }

    return (
      <View
        style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]} >

        <ScrollView>
          <View style={styles.scrollView}>

            <View style={styles.imagen}>

              <TouchableOpacity onPress={this.cambiarFotoPerfil}>
                <View style={{ display: 'flex', justifyContent: 'center' }}>

                  <WebImage
                    resizeMode="cover"
                    source={{ uri: urlFoto }}
                    style={{
                      opacity: this.state.cargandoFoto == true ? 0.2 : 1,
                      width: '100%',
                      height: '100%'
                    }} />

                  <Spinner style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    opacity: this.state.cargandoFoto == true ? 1 : 0,
                  }} color="green" />
                </View>

              </TouchableOpacity>

            </View>


            {this.renderDatosBasicos()}
            {this.renderDatosAcceso()}
            {this.renderDatosContacto()}
          </View>

        </ScrollView>

        <Animated.View style={[{ height: '100%' }, {
          maxHeight: this.keyboardHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.keyboardHeight]
          })
        }]}></Animated.View>

        {/* Dialogo Username */}
        {this.renderDialogoCambiarUsername()}

        {/* Dialogo password */}
        {this.renderDialogoCambiarPassword()}

      </View >
    );

  }

  toTitleCase(val) {
    return val.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };


  convertirFecha(fecha) {
    let partes = fecha.split('-');
    let año = partes[0];
    let mes = partes[1];
    let dia = partes[2].split('T')[0];
    return dia + '/' + mes + '/' + año;
  }

  renderDatosBasicos() {

    const nombre = this.toTitleCase(this.state.datos.nombre + ' ' + this.state.datos.apellido).trim();
    const dni = (this.state.datos.dni || 'Sin datos') + '';
    const cuil = (this.state.datos.cuil || 'Sin datos') + '';
    let fechaNacimiento = 'Sin datos';
    if (this.state.datos.fechaNacimiento != undefined) {
      fechaNacimiento = this.convertirFecha(this.state.datos.fechaNacimiento)
    }
    const iconoSexo = this.state.datos.sexoMasculino == true ? 'gender-male' : 'gender-female';
    const sexo = this.state.datos.sexoMasculino == true ? texto_Titulo_SexoMasculino : texto_Titulo_SexoFemenino;
    const domicilio = this.toTitleCase(this.state.datos.domicilioLegal || 'Sin datos').trim();

    return <View>
      <MiCardDetalle titulo={texto_Titulo_DatosPersonales}>
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Nombre} subtitulo={nombre} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Dni} subtitulo={dni} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Cuil} subtitulo={cuil} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='calendar'
          titulo={texto_Titulo_FechaNacimiento} subtitulo={fechaNacimiento} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono={iconoSexo}
          titulo={texto_Titulo_Sexo} subtitulo={sexo} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='map'
          titulo={texto_Titulo_DomicilioLegal} subtitulo={domicilio} />
      </MiCardDetalle>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 22,
        marginTop: 8,
        marginRight: 22
      }}>
        <Icon name="information-outline" style={{ fontSize: 24, color: initData.colorNaranja }} />
        <Text style={{ marginLeft: 4 }}>{texto_InfoUsuarioValidado}</Text>
      </View>
    </View>

  }

  renderDatosAcceso() {
    const initData = global.initData;

    let textoUsername = this.state.datos.username != this.state.datos.cuil ? this.state.datos.username : texto_SinUsername;
    return <View>
      <MiCardDetalle titulo={texto_Titulo_DatosAcceso} padding={false}>
        <MiItemDetalle
          icono='account'
          style={{ padding: 16 }}
          iconoAlign="flex-start"
          onPress={this.onBtnCambiarUsernameClick}
          titulo={texto_Titulo_Username}
          subtitulo={textoUsername}
        />

      </MiCardDetalle>

      <View style={{ display: 'flex', flexDirection: 'column' }}>

        <Button
          transparent
          small
          onPress={this.onBtnCambiarUsernameClick}
          style={{ alignSelf: 'center' }}>
          <Text style={{ textDecorationLine: 'underline', color: initData.colorVerde }}>{texto_Boton_ModificarUsername}</Text>
        </Button>
        <View style={{ height: 8 }} />

        <Button
          transparent
          small
          onPress={this.onBtnCambiarPasswordClick}
          style={{ alignSelf: 'center' }}><Text style={{ textDecorationLine: 'underline', color: initData.colorVerde }}>{texto_Boton_ModificarContraseña}</Text></Button>
      </View>

    </View>
  }

  renderDatosContacto() {
    const email = this.state.datos.email || 'Sin datos';
    const telefonoFijo = this.state.datos.telefonoFijo || texto_TelefonoNoRegistrado;
    const telefonoCelular = this.state.datos.telefonoCelular || texto_TelefonoNoRegistrado;

    return <View>
      <MiCardDetalle titulo={texto_Titulo_DatosContacto}>
        <MiItemDetalle
          icono='email'
          titulo={texto_Titulo_Email} subtitulo={email} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='phone'
          titulo={texto_Titulo_TelefonoCelular} subtitulo={telefonoCelular} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='phone'
          titulo={texto_Titulo_TelefonoFijo} subtitulo={telefonoFijo} />
      </MiCardDetalle>

      <Button
        transparent
        small
        onPress={this.onBtnEditarDatosContactoClick}
        style={{ alignSelf: 'center' }}>
        <Text style={{ textDecorationLine: 'underline', color: initData.colorVerde, textAlign: 'center' }}>{texto_Boton_EditarDatosContacto}</Text>
      </Button>
    </View>

  }

  onDialogoUsernameBotonCancelarPress = () => {
    this.setState({ dialogoUsernameVisible: false });
  }

  renderDialogoCambiarUsername() {
    const initData = global.initData;

    return <MiDialogo
      titulo="Cambiar nombre de usuario"
      onDismiss={this.onDialogoUsernameBotonCancelarPress}
      visible={this.state.dialogoUsernameVisible}
      cancelable={true}
      cargando={this.state.cargandoCambioUsername == true}
      botones={[
        {
          texto: 'Cancelar',
          onPress: this.onDialogoUsernameBotonCancelarPress
        },
        {
          texto: 'Cambiar',
          enabled: this.state.usernameNuevo != undefined && this.state.usernameNuevoError == false,
          onPress: this.cambiarUsername
        }
      ]}
    >
      <View style={{
        display: 'flex',
        marginBottom: 16,
        flexDirection: 'row',
        backgroundColor: initData.colorNaranja,
        padding: 8,
        borderRadius: 16
      }}>
        <Icon name="information-outline" style={{ fontSize: 30, color: 'white' }} />
        <Text style={{ marginLeft: 8, flex: 1, color: 'white', fontWeight: 'bold' }}>{texto_Info_Username}</Text>
      </View>

      <MiInputTextValidar
        onRef={(ref) => { this.inputUsernameNuevo = ref; }}
        valorInicial=''
        placeholder='Ingrese su nombre de usuario...'
        keyboardType="default"
        returnKeyType="done"
        autoCorrect={false}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        validaciones={{ requerido: true, minLength: 8, maxLength: 50, tipo: 'username' }}
        onChange={(val) => { this.setState({ usernameNuevo: val }); }}
        onError={(error) => { this.setState({ usernameNuevoError: error }) }}
      />
    </MiDialogo>
  }

  onDialogoPasswordotonCancelarPress = () => {
    this.setState({ dialogoPasswordVisible: false });
  }

  ocultarTeclado = () => {
    Keyboard.dismiss();
  }

  onDialogoPasswordAnteriorRef = (ref) => {
    this.inputPasswordAnterior = ref;
  }

  onDialogoPasswordInputPasswordAnteriorChange = (val) => {
    this.setState({ passwordAnterior: val });
  }

  onDialogoPasswordInputPasswordAnteriorError = (error) => {
    this.setState({ passwordAnteriorError: error })
  }

  onDialogoPasswordRef = (ref) => {
    this.inputPassword = ref;
  }

  onDialogoPasswordInputPasswordChange = (val) => {
    this.setState({ passwordNueva: val });
  }

  onDialogoPasswordInputPasswordError = (error) => {
    this.setState({ passwordNuevaError: error })
  }

  renderDialogoCambiarPassword() {
    const valido = this.state.passwordAnterior != undefined
      && this.state.passwordAnteriorError == false
      && this.state.passwordNueva != undefined
      && this.state.passwordNuevaError == false;

    return <MiDialogo
      titulo="Cambiar contraseña"
      onDismiss={this.onDialogoPasswordotonCancelarPress}
      visible={this.state.dialogoPasswordVisible == true}
      cancelable={true}
      cargando={this.state.cargandoCambioPassword == true}
      botones={[
        {
          texto: 'Cancelar',
          onPress: this.onDialogoPasswordotonCancelarPress
        },
        {
          texto: 'Cambiar',
          enabled: valido,
          onPress: this.cambiarPassword
        }
      ]}
    >
      <MiInputTextValidar
        onRef={this.onDialogoPasswordAnteriorRef}
        valorInicial=''
        placeholder='Contraseña actual'
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        autoCorrect={false}
        onSubmitEditing={this.ocultarTeclado}
        validaciones={{ requerido: true, minLength: 8, maxLength: 50, tipo: 'libre' }}
        onChange={this.onDialogoPasswordInputPasswordAnteriorChange}
        onError={this.onDialogoPasswordInputPasswordAnteriorError}
      />

      <MiInputTextValidar
        onRef={this.onDialogoPasswordRef}
        valorInicial=''
        placeholder='Contraseña nueva'
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        autoCorrect={false}
        onSubmitEditing={this.ocultarTeclado}
        validaciones={{ requerido: true, minLength: 8, maxLength: 50, tipo: 'libre' }}
        onChange={this.onDialogoPasswordInputPasswordChange}
        onError={this.onDialogoPasswordInputPasswordError}
      />

    </MiDialogo>
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  imagen: {
    width: 156,
    overflow: 'hidden',
    height: 156,
    borderRadius: (200 / 2),
    margin: 16,
    marginTop: 32,
    alignSelf: 'center'
  },
  scrollView: {
    width: '100%',
    padding: 16
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
});

//Texto datos personales
const texto_Titulo_DatosPersonales = 'Datos personales';
const texto_Titulo_Nombre = 'Nombre';
const texto_Titulo_Dni = 'Nº de Documento';
const texto_Titulo_Cuil = 'CUIL';
const texto_Titulo_FechaNacimiento = 'Fecha de nacimiento';
const texto_Titulo_Sexo = 'Sexo';
const texto_Titulo_SexoMasculino = 'Masculino';
const texto_Titulo_SexoFemenino = 'Femenino';
const texto_Titulo_DomicilioLegal = 'Domicilio legal'
const texto_InfoUsuarioValidado = "Como sus datos se encuentran validados por el registro nacional de personas, estos no se pueden editar.";

//Texto datos de contacto
const texto_Titulo_DatosContacto = 'Datos de contacto';
const texto_Titulo_Email = 'E-Mail';
const texto_Titulo_TelefonoFijo = 'Teléfono fijo';
const texto_Titulo_TelefonoCelular = 'Teléfono Celular';
const texto_Boton_EditarDatosContacto = 'Modificar datos de contacto';

//Texto datos de acceso
const texto_Titulo_DatosAcceso = 'Datos de acceso';
const texto_Titulo_Username = 'Nombre de usuario';
const texto_SinUsername = 'No definió un nombre de usuario.';
const texto_Boton_ModificarUsername = 'Modificar nombre de usuario';
const texto_Boton_ModificarContraseña = 'Modificar contraseña';
const texto_Info_Username = 'El nombre de usuario es un alias con el que usted puede acceder a su cuenta. Tenga en cuenta que todavia podrá acceder a través de su numero de CUIL';

const texto_TelefonoNoRegistrado = 'No registrado';
