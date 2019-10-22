import React from "react";
import { StyleSheet, View, Animated, ScrollView } from "react-native";
import { Button, Text } from "native-base";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";

//Mis componentes
import App from "Cordoba/src/UI/App";
import WebImage from "react-native-web-image";

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class Introduccion extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    const initData = global.initData;

    this.state = {
      paso: 0,
      animando: false,
      pasos: initData.intro
    };

    this.anim = new Animated.Value(1);
  }

  verSiguientePagina = () => {
    if (this.state.paso == this.state.pasos.length - 1) {
      Rules_Ajustes.setIntroVista();

      const { params } = this.props.navigation.state;
      if (params != undefined && params.callback != undefined) {
        params.callback();
      }

      App.goBack();
      return;
    }

    let paso = this.state.paso + 1;
    this.setState({ paso: paso }, () => {
      this.viewPager.setPage(paso);
    });
  }

  onPageSelected = (paso) => {
    this.setState({ paso: paso.position });
  }

  onRef = (ref) => {
    this.viewPager = ref;
  }

  render() {
    return (
      <View style={{ flex: 1, overflow: "hidden" }}>
        <IndicatorViewPager
          ref={this.onRef}
          style={{ height: "100%" }}
          onPageSelected={this.onPageSelected}
          indicator={this._renderDotIndicator()}
        >

          {this.state.pasos.map((paso, index) => {
            return this.renderPaso(paso, index);
          })}
        </IndicatorViewPager>
      </View>
    );
  }

  _renderDotIndicator() {
    return <PagerDotIndicator pageCount={this.state.pasos.length} />;
  }

  renderPaso(paso, index) {
    let textos = paso.texto.split('<br/>');
    // let urlEdificios = 'https://i.imgur.com/hhdCbuO.png';
    // urlEdificios = 'https://i.imgur.com/bHVtW2o.png';

    return (
      <View key={index} style={[styles.pagina1, { backgroundColor: paso.color }]}>

        <View style={styles.content}>

          <ScrollView style={{ backgroundColor: 'transparent' }}>

            {paso.urlImagen != undefined && paso.urlImagen != "" && (
              <View
                style={{
                  marginTop: 32,
                  borderRadius: 400,
                  overflow: "hidden",
                  height: 120,
                  width: 120,
                  alignSelf: "center"
                }}
              >
                <WebImage
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="contain"
                  source={{ uri: paso.urlImagen }}
                />
              </View>

            )}


            <Text style={{ fontSize: 28, backgroundColor: 'transparent', marginTop: 16, marginBottom: 16, color: paso.colorTexto, alignSelf: "center" }}>{paso.titulo}</Text>
            {textos.map((texto, index) => {

              let bold = texto.indexOf('bold_') != -1;
              if (bold == true) {
                texto = texto.substring(5, texto.length);
              }

              return <Text key={index} style={{
                fontSize: 16,
                color: paso.colorTexto,
                backgroundColor: 'transparent',
                alignSelf: "center",
                textAlign: "center",
                fontWeight: bold ? 'bold' : 'normal'
              }}>
                {texto}
              </Text>
            })}
          </ScrollView>

        </View>
        <View style={styles.footer}>
          <Button
            rounded
            disabled={this.state.animando}
            onPress={this.verSiguientePagina}
            style={[
              styles.btnSiguiente,
              { backgroundColor: paso.boton.color, shadowColor: paso.boton.color }
            ]}
          >
            <Text style={{ color: paso.boton.colorTexto }}>{paso.boton.texto}</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  pagina1: {
    width: "100%",
    height: "100%",
    paddingBottom: 32
  },
  content: {
    padding: 32,
    display: "flex",
    justifyContent: 'center',
    flex: 1
  },
  footer: {
    padding: 16
  },
  btnSiguiente: {
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },

    alignSelf: "center"
  }
});

const texto_Titulo = "Introducción";
