import React from "react";
import { View, Image, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "native-base";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import autobind from "autobind-decorator";

//Mis componentes
import MiView from "@Utils/MiView";

export default class RequerimientoNuevo_PasoFoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      foto: undefined,
      viewSeleccionarVisible: true,
      viewSeleccionadoVisible: false
    };
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    onReady: () => {},
    onFoto: () => {},
    onCargando: () => {}
  };

  componentWillUpdate(prevProps, prevState) {
    if (this.state.cargando != prevState.cargando) {
      this.props.onCargando(prevState.cargando);
    }
  }

  @autobind
  agregarFoto() {
    Alert.alert("", "Agregar foto", [
      { text: "Galeria", onPress: this.agregarFotoDesdeGaleria },
      { text: "Cámara", onPress: this.agregarFotoDesdeCamara }
    ]);
  }

  @autobind
  agregarFotoDesdeCamara() {
    var options = {
      title: "Elegir foto"
    };

    this.setState(
      {
        cargando: true
      },
      function() {
        // Mando a buscar la foto
        ImagePicker.launchCamera(
          options,
          function(response) {
            if (response.didCancel) {
              this.setState({
                cargando: false
              });
              return;
            }

            if (response.error) {
              this.setState({
                cargando: false,
                foto: undefined
              });

              Alert.alert("", "Error procesando la solicitud. Error: " + response.error);
              return;
            }

            this.procesarImagen(response.uri);
          }.bind(this)
        );
      }.bind(this)
    );
  }

  @autobind
  agregarFotoDesdeGaleria() {
    var options = {
      title: "Elegir foto"
    };

    this.setState(
      {
        cargando: true
      },
      function() {
        // Mando a buscar la foto
        ImagePicker.launchImageLibrary(
          options,
          function(response) {
            if (response.didCancel) {
              this.setState({
                cargando: false
              });
              return;
            }

            if (response.error) {
              this.setState({
                cargando: false
              });

              Alert.alert("", "Error procesando la solicitud. Error: " + response.error);
              return;
            }

            this.procesarImagen(response.uri);
          }.bind(this)
        );
      }.bind(this)
    );
  }

  @autobind
  procesarImagen(img) {
    // Achico la imagen
    ImageResizer.createResizedImage(img, 1000, 1000, "JPEG", 80)
      .then(
        function(responseResize) {
          // Convierto la imagen a base64
          RNFS.readFile(responseResize.uri, "base64")
            .then(
              function(base64) {
                let foto = "data:image/jpeg;base64," + base64;
                this.setState(
                  {
                    cargando: false,
                    foto: foto
                  },
                  this.informarFoto
                );
              }.bind(this)
            )
            .catch(
              function() {
                Alert.alert("", "Error procesando la solicitud. Leyendo");
                this.setState({
                  cargando: false
                });
              }.bind(this)
            );
        }.bind(this)
      )
      .catch(
        function(err) {
          Alert.alert("", "Error procesando la solicitud. Resize");
          this.setState({
            cargando: false
          });
        }.bind(this)
      );
  }

  @autobind
  cancelarFoto() {
    this.setState(
      { viewSeleccionadoVisible: false },

      function() {
        setTimeout(
          function() {
            this.setState(
              { foto: undefined, viewSeleccionarVisible: true },
              function() {
                this.props.onFoto(undefined);
              }.bind(this)
            );
          }.bind(this),
          300
        );
      }
    );
  }

  @autobind
  informarFoto() {
    this.setState(
      { viewSeleccionarVisible: false },
      function() {
        setTimeout(
          function() {
            this.setState({ viewSeleccionadoVisible: true });
          }.bind(this),
          300
        );
      }.bind(this)
    );

    this.props.onFoto(this.state.foto);
  }

  @autobind
  informarReady() {
    this.props.onReady();
  }

  @autobind
  abrirImagen() {
    // App.navegar('VisorFoto', {
    //     source: { uri: this.state.foto }
    // });
  }

  render() {
    const initData = global.initData;

    return (
      <View>
        <View style={{ minHeight: 100 }}>
          {this.renderViewSeleccionar()}
          {this.renderViewSeleccionado()}
        </View>

        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        <View style={{ padding: 16 }}>
          <Button
            onPress={this.informarReady}
            rounded
            small
            bordered
            style={{
              alignSelf: "flex-end",
              backgroundColor: initData.colorExito
            }}
          >
            <Text style={{ color: "white" }}>Siguiente</Text>
          </Button>
        </View>
      </View>
    );
  }

  renderViewSeleccionar() {
    const initData = global.initData;

    return (
      <MiView visible={this.state.viewSeleccionarVisible}>
        <View style={{ padding: 16 }}>
          <Button
            bordered
            rounded
            small
            onPress={this.agregarFoto}
            style={{
              alignSelf: "center",
              borderColor: initData.colorExito
            }}
          >
            <Text style={{ color: initData.colorExito }}>Agregar foto</Text>
          </Button>
        </View>
      </MiView>
    );
  }

  renderViewSeleccionado() {
    const initData = global.initData;

    return (
      <MiView visible={this.state.viewSeleccionadoVisible}>
        <View style={{ padding: 16 }}>
          <View style={{ borderRadius: 16, overflow: "hidden" }}>
            <TouchableOpacity onPress={this.abrirImagen}>
              <Image
                resizeMode="cover"
                style={{ width: 156, height: 156, alignSelf: "center", borderRadius: 16, overflow: "hidden" }}
                source={{ uri: this.state.foto }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ height: 16 }} />

          <Button small transparent style={{ alignSelf: "center" }} onPress={this.cancelarFoto}>
            <Text style={{ color: initData.colorError, textDecorationLine: "underline" }}>Cancelar foto</Text>
          </Button>
        </View>
      </MiView>
    );
  }
}
