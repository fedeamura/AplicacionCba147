import React from "react";
import {
  View,
  BackHandler,
  StyleSheet,
  Alert
} from "react-native";
import MiToolbarMenu from "@Utils/MiToolbarMenu";
import PaginaInicio from "@Paginas/Requerimientos/Index";
import PaginaPerfil from "@Paginas/Perfil/Index";
import PaginaAjustes from "@Paginas/Ajustes/Index";
import MiStatusBar from "@Utils/MiStatusBar";
import App from "@UI/App"

const texto_Titulo = 'Inicio';
const texto_Menu_MisRequerimientos = 'Mis requerimientos';
const texto_Menu_MiPerfil = 'Mi perfil';
const texto_Menu_Ajustes = 'Ajustes';

export default class Login extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      expandido: false,
      opciones: [
        {
          backgroundColor: '#43A047',
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
          backgroundColor: '#FFA726',
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
          backgroundColor: '#9E9E9E',
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
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   Alert.alert('', '¿Desea salir de #CBA147?', [
    //     { text: 'Si', onPress: () => { BackHandler.exitApp(); } },
    //     { text: 'No', onPress: () => { } },
    //   ]);
    //   return true;
    // });
  }

  render() {

    const initData = global.initData;
    const colorToolbar = initData.toolbar_Dark ? 'white' : 'black';
    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

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
      </View>

    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  }
})