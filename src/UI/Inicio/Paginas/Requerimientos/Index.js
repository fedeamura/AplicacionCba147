import React from "react";
import {
  View,
  Animated,
  StyleSheet,
  Alert,
  BackHandler
} from "react-native";
import {
  Button,
  Text,
} from "native-base";
import WebImage from 'react-native-web-image'

//Mis componentes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "@Utils/Requerimiento/CardItem";
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";

const texto_BotonNuevo = 'Nuevo requerimiento';
const url_Imagen_Error = "https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png"
const texto_Error_Consultado = 'Oops... Algo salió mal al consultar sus requerimientos';
const texto_Boton_Reintentar = 'Reintentar';
const url_Imagen_Empty = "https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png";
const texto_Empty = "No registraste ningún requerimiento aún..."
const texto_Boton_Empty = 'Registrar uno';

export default class PaginaInicio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined,
      requerimientos: []
    };

    this.animBoton = new Animated.Value(0);
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   if (this.state.cargando == true) return true;
    // });
  }

  mostrarBotonNuevo = () => {
    Animated.timing(this.animBoton, {
      toValue: 1,
      duration: 300
    }).start();
  }

  ocultarBotonNuevo = () => {
    Animated.timing(this.animBoton, {
      toValue: 0,
      duration: 300
    }).start();
  }

  buscarRequerimientos = () => {
    this.setState({
      cargando: true
    }, () => {

      this.ocultarBotonNuevo();

      Rules_Requerimiento.get()
        .then((requerimientos) => {

          this.setState({
            cargando: false,
            error: undefined,
            requerimientos: requerimientos
          }, () => {
            if (requerimientos.length == 0) {
              this.ocultarBotonNuevo();
            } else {
              this.mostrarBotonNuevo();
            }
          });
        }).catch((error) => {

          this.setState({
            cargando: false,
            requerimientos: [],
            error: error
          }, () => {
            this.ocultarBotonNuevo();
          });
        })
    });
  }

  abrirNuevoRequerimiento = () => {
    App.navegar('RequerimientoNuevo', {
      callback: () => {
        this.buscarRequerimientos();
      },
      verDetalleRequerimiento: (id) => {
        this.buscarRequerimientos();
        this.verDetalleRequerimiento(id);
      }
    });
  }

  verDetalleRequerimiento = (id) => {
    Alert.alert('', 'Ver detalle');
  }

  render() {
    const initData = global.initData;

    return (
      <View
        onLayout={this.buscarRequerimientos}
        style={[styles.contenedor]}>
        <MiListado
          backgroundColor={initData.backgroundColor}
          style={[styles.listado]}
          keyExtractor={(item) => { return item.id }}
          onRefresh={this.buscarRequerimientos}
          refreshing={this.state.cargando}
          error={this.state.cargando == false && this.state.error != undefined}
          data={this.state.requerimientos}
          //Item
          renderItem={(item) => {
            return <ItemRequerimiento
              onPress={this.verDetalleRequerimiento}
              numero={item.item.numero}
              año={item.item.año}
              estadoColor={item.item.estadoColor}
              estadoNombre={item.item.estadoNombre}
              fechaAlta={item.item.fechaAlta}
            />;
          }}
          // Empty
          renderEmpty={() => {
            return <View style={styles.contenedor_Empty} >
              <WebImage
                resizeMode="cover"
                style={styles.imagen_Empty}
                source={{ uri: url_Imagen_Empty }}
              />

              <Text style={styles.texto_Empty}>{texto_Empty}</Text>

              <Button
                rounded={true}
                style={styles.boton_Empty}
                onPress={this.abrirNuevoRequerimiento}>
                <Text style={styles.boton_EmptyTexto}>{texto_Boton_Empty}
                </Text>
              </Button>
            </View>
          }}
          // Error
          renderError={() => {
            return <View style={styles.contenedor_Error} >
              <WebImage
                resizeMode="cover"
                style={styles.imagen_Error}
                source={{ uri: url_Imagen_Error }}
              />

              <Text style={styles.texto_Error}>{texto_Error_Consultado}</Text>
              <Text style={styles.texto_ErrorDetalle}>{this.state.error}</Text>

              <Button
                rounded={true}
                style={styles.boton_Error}
                onPress={this.buscarRequerimientos}>
                <Text style={styles.boton_ErrorTexto}>{texto_Boton_Reintentar}</Text>
              </Button>
            </View>
          }}

        />

        {/* Boton nuevo requerimiento */}
        <Animated.View
          pointerEvents={this.state.cargando == true || this.state.error != undefined || this.state.requerimientos == undefined || this.state.requerimientos.length == 0 ? 'none' : 'auto'}
          style={{
            minHeight: 72,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 0,
            left: 0, right: 0,
            opacity: this.animBoton.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }}
        >

          <Button
            iconLeft
            rounded={true}
            style={styles.btnNuevo}
            onPress={this.abrirNuevoRequerimiento}
          >
            <Text style={styles.botoNuevoTexto}>
              {texto_BotonNuevo}
            </Text>
          </Button>

        </Animated.View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  listado: {
    padding: 16,
    paddingBottom: 72
  },
  btnNuevo: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "green",
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    shadowOffset: { width: 0, height: 7 }
  },
  botoNuevoTexto: {
    color: 'white'
  },
  //Error
  contenedor_Error: {
    position: "absolute",
    backgroundColor: "rgba(230,230,230,1)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  imagen_Error: {
    backgroundColor: "transparent",
    width: 250,
    height: 250
  },
  texto_Error: {
    maxWidth: 300,
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginTop: 16,
    marginLeft: 0,
    marginRight: 0
  },
  texto_ErrorDetalle: {
    maxWidth: 300,
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0
  },
  boton_Error: {
    backgroundColor: "green",
    alignSelf: "center",
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    shadowOffset: { width: 0, height: 7 }
  },
  boton_ErrorTexto: {
    color: 'white'
  },
  //Empty
  contenedor_Empty: {
    position: "absolute",
    backgroundColor: "rgba(230,230,230,1)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  imagen_Empty: {
    backgroundColor: "transparent",
    width: 250,
    height: 250
  },
  texto_Empty: {
    maxWidth: 300,
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0
  },
  boton_Empty: {
    backgroundColor: "green",
    alignSelf: "center",
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    shadowOffset: { width: 0, height: 7 }
  },
  boton_Empty_Texto: {
    color: 'white'
  },
})