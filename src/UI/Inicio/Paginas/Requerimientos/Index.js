import React from "react";
import { View, Animated, Alert, StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import { FAB } from "react-native-paper";

//Mis componentes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "@Utils/Requerimiento/CardItem";
import MiPanelError from "@Utils/MiPanelError";

//Rules
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";
import Rules_Notificaciones from "@Rules/Rules_Notificaciones";

export default class PaginaInicio_Requerimientos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined,
      requerimientos: []
    };

    this.animBoton = new Animated.Value(0);

    this.mostrarBotonNuevo = this.mostrarBotonNuevo.bind(this);
    this.ocultarBotonNuevo = this.ocultarBotonNuevo.bind(this);
    this.buscarRequerimientos = this.buscarRequerimientos.bind(this);
    this.abrirNuevoRequerimiento = this.abrirNuevoRequerimiento.bind(this);
    this.verDetalleRequerimiento = this.verDetalleRequerimiento.bind(this);
  }

  componentDidMount() {
    //Si la app se abrio desde una notif...
    if (global.notificacionInicial != undefined) {
      const data = global.notificacionInicial;
      global.notificacionInicial = undefined;

      //Mando a manejar
      Rules_Notificaciones.manejar(data);
    }
  }

  mostrarBotonNuevo() {
    Animated.timing(this.animBoton, {
      toValue: 1,
      duration: 300
    }).start();
  }

  ocultarBotonNuevo() {
    Animated.timing(this.animBoton, {
      toValue: 0,
      duration: 300
    }).start();
  }

  buscarRequerimientos() {
    this.setState(
      {
        cargando: true
      },
      function() {
        this.ocultarBotonNuevo();

        Rules_Requerimiento.get()
          .then(
            function(requerimientos) {
              this.setState(
                {
                  cargando: false,
                  error: undefined,
                  requerimientos: requerimientos
                },
                function() {
                  if (requerimientos.length == 0) {
                    this.ocultarBotonNuevo();

                    if (global.primeraVezMandeRegistrar != true) {
                      this.abrirNuevoRequerimiento();
                      global.primeraVezMandeRegistrar = true;
                    }
                  } else {
                    this.mostrarBotonNuevo();
                  }
                }.bind(this)
              );
            }.bind(this)
          )
          .catch(
            function(error) {
              this.setState(
                {
                  cargando: false,
                  requerimientos: [],
                  error: error
                },
                function() {
                  this.ocultarBotonNuevo();
                }.bind(this)
              );
            }.bind(this)
          );
      }.bind(this)
    );
  }

  abrirNuevoRequerimiento() {
    App.navegar("RequerimientoNuevo", {
      callback: function() {
        this.buscarRequerimientos();
      }.bind(this),

      verDetalleRequerimiento: function(id) {
        this.buscarRequerimientos();
        this.verDetalleRequerimiento(id);
      }.bind(this)
    });
  }

  verDetalleRequerimiento(id) {
    App.navegar("RequerimientoDetalle", { id: id });
  }

  render() {
    const initData = global.initData;

    return (
      <View onLayout={this.buscarRequerimientos} style={[styles.contenedor]}>
        <MiListado
          backgroundColor={initData.backgroundColor}
          style={[styles.listado]}
          keyExtractor={item => {
            return item.id;
          }}
          onRefresh={this.buscarRequerimientos}
          refreshing={this.state.cargando}
          error={this.state.cargando == false && this.state.error != undefined}
          data={this.state.requerimientos}
          //Item
          renderItem={item => {
            return <ItemRequerimiento onPress={this.verDetalleRequerimiento} data={item.item} />;
          }}
          // Empty
          renderEmpty={() => {
            return (
              <MiPanelError
                mostrarImagen={true}
                titulo={texto_Empty}
                mostrarBoton={true}
                urlImagen="https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png"
                textoBoton={texto_Boton_Empty}
                onBotonPress={this.abrirNuevoRequerimiento}
              />
            );
          }}
          // Error
          renderError={() => {
            return (
              <MiPanelError
                mostrarImagen={true}
                titulo={texto_Error_Consultado}
                detalle={this.state.error}
                mostrarBoton={true}
                icono="alert-circle-outline"
                textoBoton={texto_Boton_Reintentar}
                onBotonPress={this.buscarRequerimientos}
              />
            );
          }}
        />

        {/* Boton nuevo requerimiento */}
        <Animated.View
          pointerEvents={
            this.state.cargando == true ||
            this.state.error != undefined ||
            this.state.requerimientos == undefined ||
            this.state.requerimientos.length == 0
              ? "none"
              : "auto"
          }
          style={{
            position: "absolute",
            right: 0,
            padding: 24,
            bottom: 0,
            opacity: this.animBoton.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
            transform: [
              {
                scale: this.animBoton
              }
            ]
          }}
        >
          <FAB
            icon="add"
            style={{ backgroundColor: initData.colorVerde }}
            color="white"
            onPress={this.abrirNuevoRequerimiento}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  },
  listado: {
    padding: 16,
    paddingBottom: 104
  }
});

//TExtos
const texto_Error_Consultado = "Oops... Algo salió mal al consultar sus requerimientos";
const texto_Boton_Reintentar = "Reintentar";
const texto_Empty = "No posee ningún requerimiento para mostrar...";
const texto_Boton_Empty = "Aregar requerimiento";
