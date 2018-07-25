import React from "react";
import {
  View,
  Animated,
  ScrollView,
  Alert,
  StyleSheet
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
import MiCardDetalle from '@Utils/MiCardDetalle';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiPanelError from "@Utils/MiPanelError";
import MiDialogo from "@Utils/MiDialogo";
import MiInputTextValidar from "@Utils/MiInputTextValidar";

//Rules
import Rules_Usuario from '@Rules/Rules_Usuario';
import App from "../../../App";
import { TouchableRipple } from "../../../../../node_modules/react-native-paper";

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
      cargandoCambioPassword: false
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {
    this.setState({ cargando: true },
      () => {
        Rules_Usuario.getDatos()
          .then((datos) => {
            this.setState({ cargando: false, datos: datos });
          })
          .catch((error) => {
            this.setState({ cargando: false, error: error });
          });;
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
          this.setState({ dialogoUsernameVisible: false }, () => {
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

          //Informo
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
    this.setState({ cargandoCambioPassword: true }, () => {
      Rules_Usuario.cambiarPassword(this.state.passwordAnterior, this.state.passwordNueva)
        .then(() => {
          this.setState({ dialogoPasswordVisible: false }, () => {
            //Informo
            Snackbar.show({ title: 'Contraseña cambiada correctamente' });
          });
        })
        .catch((error) => {
          this.setState({ cargandoCambioPassword: false });

          //Informo
          Snackbar.show({ title: 'Error procesando la solicitud' });
        });
    });
  }

  onBtnEditarDatosContactoClick = () => {
    App.navegar('UsuarioEditarDatosContacto', {
      callback: () => {
        this.buscarDatos();
      }
    });
  }

  cambiarFoto = () => {
    Alert.alert('', 'Cambiar foto de perfil', [
      { text: 'Cancelar', onPress: () => { } },
      { text: 'Galeria', onPress: this.cambiarFotoDesdeGaleria },
      { text: 'Cámara', onPress: this.cambiarFotoDesdeCamara },
    ]);
  }

  cambiarFotoDesdeCamara = () => {
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
        else if (response.error) {
          this.setState({
            cargandoFoto: false
          });

          Alert.alert('', 'Error procesando la solicitud. Error: ' + response.error);
          return
        }


        this.procesarImagen(response.uri);
      });

    });
  }

  cambiarFotoDesdeGaleria = () => {
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
        else if (response.error) {
          this.setState({
            cargandoFoto: false
          });

          Alert.alert('', 'Error procesando la solicitud');
          return
        }

        this.procesarImagen(response.uri);
      });

    });

  }

  procesarImagen = (img) => {
    // Achico la imagen
    ImageResizer.createResizedImage(img, 1000, 1000, 'JPEG', 80)
      .then((response2) => {
        // Convierto la imagen a base64
        RNFS.readFile(response2.uri, 'base64')
          .then(base64 => {
            let foto = 'data:image/jpeg;base64,' + base64;

            Rules_Usuario.cambiarFoto(foto)
              .then(() => {
                this.setState({
                  cargandoFoto: false,
                  datos: {
                    ...this.state.datos,
                    IdentificadorFotoPersonal: "test"
                  }
                });

                Snackbar.show({ title: 'Imagen de perfil actualizada correctamente' });

              })
              .catch((error) => {
                this.setState({ cargandoFoto: false });
                Alert.alert('', error || 'Error procesando la solicitud');
              });
            // this.setState({
            //   cargandoFoto: false,
            //   foto: foto
            // }, this.informarFoto);
          }).catch(() => {
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

    if (this.state.cargando == true) {
      return (<View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        <Spinner color="green" />
      </View >);
    }

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
    if (this.state.datos.IdentificadorFotoPersonal != undefined) {
      urlFoto = initData.url_placeholder_user_male;
    } else {
      urlFoto = this.state.datos.SexoMasculino ? initData.url_placeholder_user_male : initData.url_placeholder_user_female;
    }

    return (
      <View
        style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]} >

        <ScrollView>
          <View style={styles.scrollView}>
            <View style={styles.imagen}>
              <TouchableRipple onPress={this.cambiarFoto}>
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

              </TouchableRipple>

            </View>


            {this.renderDatosBasicos()}
            {this.renderDatosAcceso()}
            {this.renderDatosContacto()}
          </View>

        </ScrollView>


        {/* Dialogo Username */}
        {this.renderDialogoCambiarUsername()}

        {/* Dialogo password */}
        {this.renderDialogoCambiarPassword()}

      </View >
    );
  }

  renderDatosBasicos() {
    return <View>
      <MiCardDetalle titulo={texto_Titulo_DatosPersonales}>
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Nombre} subtitulo={this.state.datos.Nombre + ' ' + this.state.datos.Apellido} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Dni} subtitulo={this.state.datos.Dni} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='account-card-details'
          titulo={texto_Titulo_Cuil} subtitulo={this.state.datos.Cuil} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='calendar'
          titulo={texto_Titulo_FechaNacimiento} subtitulo={this.state.datos.FechaNacimiento} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='gender-male'
          titulo={texto_Titulo_Sexo} subtitulo={this.state.datos.SexoMasculino ? texto_Titulo_SexoMasculino : texto_Titulo_SexoFemenino} />
        <View style={{ height: 16 }} />
        <MiItemDetalle
          icono='map'
          titulo={texto_Titulo_DomicilioLegal} subtitulo={this.state.datos.DomicilioLegal} />
      </MiCardDetalle>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginTop: 8,
        marginRight: 20
      }}>
        <Icon name="information-outline" style={{ fontSize: 24 }} />
        <Text style={{ marginLeft: 4 }}>{texto_InfoUsuarioValidado}</Text>
      </View>
    </View>

  }

  renderDatosAcceso() {

    let textoUsername = this.state.datos.Username != this.state.datos.Cuil ? this.state.datos.Username + '. Si desea cambiarlo haga click aquí' : texto_SinUsername;
    return <MiCardDetalle titulo={texto_Titulo_DatosAcceso} padding={false}>
      <MiItemDetalle
        icono='account'
        style={{ padding: 16 }}
        iconoAlign="flex-start"
        onPress={this.onBtnCambiarUsernameClick}
        titulo={texto_Titulo_Username}
        subtitulo={textoUsername}
      />
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
      <MiItemDetalle
        icono='key'
        style={{ padding: 16 }}
        iconoAlign="flex-start"
        onPress={this.onBtnCambiarPasswordClick}
        titulo={texto_Titulo_Password} subtitulo={texto_Contraseña_Detalle}
      />
    </MiCardDetalle>
  }

  renderDatosContacto() {
    return <MiCardDetalle titulo={texto_Titulo_DatosContacto} botones={[
      {
        texto: texto_Boton_EditarDatosContacto,
        onPress: this.onBtnEditarDatosContactoClick
      }
    ]}>
      <MiItemDetalle
        icono='email'
        titulo={texto_Titulo_Email} subtitulo={this.state.datos.Email} />
      <View style={{ height: 16 }} />
      <MiItemDetalle
        icono='phone'
        titulo={texto_Titulo_TelefonoCelular} subtitulo={this.state.datos.TelefonoCelular} />
      <View style={{ height: 16 }} />
      <MiItemDetalle
        icono='phone'
        titulo={texto_Titulo_TelefonoFijo} subtitulo={this.state.datos.TelefonoFijo} />
    </MiCardDetalle>


  }

  renderDialogoCambiarUsername() {
    return <MiDialogo
      titulo="Cambiar nombre de usuario"
      onDismiss={() => { this.setState({ dialogoUsernameVisible: false }) }}
      visible={this.state.dialogoUsernameVisible}
      cancelable={true}
      cargando={this.state.cargandoCambioUsername == true}
      botones={[
        {
          texto: 'Cancelar',
          onPress: () => {
            this.setState({ dialogoUsernameVisible: false });
          }
        },
        {
          texto: 'Cambiar',
          enabled: this.state.usernameNuevo != undefined && this.state.usernameNuevoError == false,
          onPress: this.cambiarUsername
        }
      ]}
    >
      <View style={{ display: 'flex', marginBottom: 16, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', padding: 8, borderRadius: 8 }}>
        <Icon name="information-outline" style={{ fontSize: 24 }} />
        <Text style={{ marginLeft: 8, flex: 1 }}>El nombre de usuario es un alias con el que usted puede acceder a su cuenta. Tenga en cuenta que todavia podrá acceder a través de su numero de CUIL</Text>
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

  renderDialogoCambiarPassword() {
    const valido = this.state.passwordAnterior != undefined
      && this.state.passwordAnteriorError == false
      && this.state.passwordNueva != undefined
      && this.state.passwordNuevaError == false;

    return <MiDialogo
      titulo="Cambiar contraseña"
      onDismiss={() => { this.setState({ dialogoPasswordVisible: false }) }}
      visible={this.state.dialogoPasswordVisible == true}
      cancelable={true}
      cargando={this.state.cargandoCambioPassword == true}
      botones={[
        {
          texto: 'Cancelar',
          onPress: () => {
            this.setState({ dialogoPasswordVisible: false });
          }
        },
        {
          texto: 'Cambiar',
          enabled: valido,
          onPress: this.cambiarPassword
        }
      ]}
    >
      <MiInputTextValidar
        onRef={(ref) => { this.inputPasswordAnterior = ref; }}
        valorInicial=''
        placeholder='Contraseña actual'
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        autoCorrect={false}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        validaciones={{ requerido: true, minLength: 8, maxLength: 50, tipo: 'libre' }}
        onChange={(val) => { this.setState({ passwordAnterior: val }); }}
        onError={(error) => { this.setState({ passwordAnteriorError: error }) }}
      />
      <MiInputTextValidar
        onRef={(ref) => { this.inputUsernameNuevo = ref; }}
        valorInicial=''
        placeholder='Contraseña nueva'
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        autoCorrect={false}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        validaciones={{ requerido: true, minLength: 8, maxLength: 50, tipo: 'libre' }}
        onChange={(val) => { this.setState({ passwordNueva: val }); }}
        onError={(error) => { this.setState({ passwordNuevaError: error }) }}
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
const texto_Boton_EditarDatosContacto = 'Editar';

//Texto datos de acceso
const texto_Titulo_DatosAcceso = 'Datos de acceso';
const texto_Titulo_Username = 'Nombre de usuario';
const texto_SinUsername = 'Usted no definió un nombre de usuario. Si lo desea puede hacerlo haciendo click aqui';

const texto_Titulo_Password = 'Contraseña';
const texto_Contraseña_Detalle = 'Haga click aquí para cambiar su contraseña';




