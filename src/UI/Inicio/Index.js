import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  BackAndroid,
  ScrollView
} from "react-native";
import WebImage from 'react-native-web-image';
import {
  Dialog,
  Paragraph,
  Button as ButtonPeper,
  DialogActions,
  DialogContent
} from 'react-native-paper';
import { BackHandler } from "react-native";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbarMenu from "@Utils/MiToolbarMenu";
import PaginaInicio from "@Paginas/Requerimientos/Index";
import PaginaPerfil from "@Paginas/Perfil/Index";
import PaginaAjustes from "@Paginas/Ajustes/Index";

const texto_Titulo = 'Inicio';
const texto_Menu_MisRequerimientos = 'Mis requerimientos';
const texto_Menu_MiPerfil = 'Mi perfil';
const texto_Menu_Ajustes = 'Ajustes';

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
      ]
    };

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {
      BackHandler.addEventListener('hardwareBackPress', this.back);
    });

    this._willBlurSubscription = props.navigation.addListener('willBlur', payload => {
      BackHandler.removeEventListener('hardwareBackPress', this.back);
    });

  }

  back = () => {
    if (this.state.expandido == true) {
      this.setState({ expandido: false });
      return true;
    }

    if (this.state.dialogoConfirmarSalidaVisible != true) {
      this.setState({ dialogoConfirmarSalidaVisible: true });
      return true;
    }
  }

  render() {

    const initData = global.initData;
    const colorToolbar = initData.toolbar_Dark ? 'white' : 'black';
    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        {/* <AndroidBackButton onPress={this.back} /> */}

        <MiStatusBar />

        <MiToolbarMenu
          toolbarHeight={initData.toolbar_Height}
          toolbarBackgroundColor={initData.toolbar_BackgroundColor}
          toolbarTituloColor={colorToolbar}
          expandido={this.state.expandido}
          opciones={this.state.opciones}
          expandirAlHacerClick={false}
          mostrarBotonCerrar={true}
          iconoCerrar='close'
          iconoCerrarColor='white'
          mostrarBotonIzquierda={true}
          iconoIzquierdaColor={colorToolbar}
          iconoIzquierda='menu'
          iconoIzquierdaOnPress={() => { this.setState({ expandido: true }) }}
        />

        {this.renderDialogoConfirmarSalida()}
      </View>
    );
  }

  renderDialogoConfirmarSalida() {
    return <Dialog
      style={{ borderRadius: 16 }}
      visible={this.state.dialogoConfirmarSalidaVisible}
      onDismiss={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}
    >
      <DialogContent>
        <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
          <Paragraph>{texto_DialogoConfirmarSalir}</Paragraph>
        </ScrollView>
      </DialogContent>
      <DialogActions>
        <ButtonPeper onPress={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}>No</ButtonPeper>
        <ButtonPeper onPress={() => {
          this.setState({
            dialogoConfirmarSalidaVisible: false
          }, () => {
            BackAndroid.exitApp();
          })
        }}>Si</ButtonPeper>
      </DialogActions>
    </Dialog>
  }
}

const texto_DialogoConfirmarSalir = '¿Esta seguro que desea salir de la aplicación #CBA147?';


// renderFooter() {
//   return <View style={{
//     backgroundColor:'#01a15a',
//     padding: 16, paddingTop: 8, paddingBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center'
//   }}>
//     <WebImage
//       style={{ height: 40, width: 40, marginRight: 8 }}
//       resizeMode='contain'
//       source={require("@Resources/cba147_logo.png")} />

//     <Text style={{ fontSize: 20, color:'white' }}>Municipalidad de Córdoba</Text>
//   </View>;
// }

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  }
})