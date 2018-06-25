import React from "react";
import { View, StyleSheet } from "react-native";

//Mis compontentes
import { Text } from "native-base";
import { Card } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';

import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class RequerimientoCardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tipo: undefined
    };
  }

  componentDidMount() {
    Rules_Ajustes.getListadoRequerimientoInterfaz().then((result) => {
      this.setState({
        tipo: result
      });
    });
  }

  render() {
    if (this.state.tipo == undefined) return null;

    let view = null;
    switch (parseInt(this.state.tipo)) {
      case 1: {
        view = this.render1();
      } break;

      case 2: {
        view = this.render2();
      } break;

      default: {
        view = this.render1();
      } break;
    }

    return view;
  }

  render1 = () => {
    return (
      <Card
        style={styles.cardItem}
        onPress={this.props.onPress}>

        <View style={[styles.cardItemHeader, { backgroundColor: this.props.estadoColor }]}>
          {this.state.tipo == 1 && (
            <LinearGradient
              colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
              backgroundColor="transparent"
              style={styles.cardItemHeaderGradiente}
              pointerEvents="none" />
          )}

          <View style={styles.contenedorNumero}>
            <Text style={styles.textoNumero}> {this.props.numero + '/' + this.props.año}</Text>
          </View>
          <View style={styles.contenedorFecha}>
            <Text style={styles.textoEstado}>{this.props.estadoNombre}</Text>
            <Text style={styles.textoFecha}>{this.props.fechaAlta}</Text>
          </View>
        </View>

        <View style={styles.contenedorDatos}>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Servicio: </Text>
            <Text style={styles.texto_ItemDetalle}>Alumbrado</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Motivo: </Text>
            <Text style={styles.texto_ItemDetalle}>Foco Roto</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>CPC: </Text>
            <Text style={styles.texto_ItemDetalle}>Nº 10 - Central</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Barrio: </Text>
            <Text style={styles.texto_ItemDetalle}>Centro</Text>
          </View>
        </View>

      </Card>
    );
  }

  render2() {
    return (
      <Card
        style={styles2.cardItem}
        onPress={this.props.onPress}>

        <View style={[styles2.cardItemHeader]}>
          <View style={styles2.contenedorNumero}>
            <Text style={styles2.textoNumero}> {this.props.numero + '/' + this.props.año}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 16, height: 16, backgroundColor: this.props.estadoColor, borderRadius: 16, marginRight: 4 }}></View>
              <Text style={styles2.textoEstado}>{this.props.estadoNombre}</Text>
            </View>
          </View>
          <Text style={styles2.textoFecha}>{this.props.fechaAlta}</Text>
        </View>

        <View style={{ width: '100%', height: 3, backgroundColor: this.props.estadoColor, opacity:0.4 }}></View>
        <View style={styles.contenedorDatos}>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Servicio: </Text>
            <Text style={styles.texto_ItemDetalle}>Alumbrado</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Motivo: </Text>
            <Text style={styles.texto_ItemDetalle}>Foco Roto</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>CPC: </Text>
            <Text style={styles.texto_ItemDetalle}>Nº 10 - Central</Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text style={styles.texto_ItemTitulo}>Barrio: </Text>
            <Text style={styles.texto_ItemDetalle}>Centro</Text>
          </View>
        </View>

      </Card >
    );
  }
}


const styles = StyleSheet.create({
  cardItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8
  },
  cardItemHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: "flex",
    flexDirection: "row",
    padding: 16
  },
  cardItemHeaderGradiente: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden"
  },
  contenedorNumero: {
    flex: 1
  },
  textoNumero: {
    fontWeight: "bold",
    fontSize: 24,
    backgroundColor: 'transparent',
    color: 'white'
  },
  contenedorFecha: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  textoEstado: {
    fontWeight: "bold",
    backgroundColor: 'transparent',
    color: 'white'
  },
  textoFecha: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: 'white'
  },
  contenedorDatos: {
    padding: 16
  },
  contenedorItem: {
    display: 'flex',
    flexDirection: 'row'
  },
  texto_ItemTitulo: {
    fontWeight: "bold",
    backgroundColor: 'transparent',
    color: 'black'
  },
  texto_ItemDetalle: {
    backgroundColor: 'transparent',
    color: 'black'
  }
});

const styles2 = StyleSheet.create({
  cardItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8
  },
  cardItemHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: "flex",
    flexDirection: "row",
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.025)'
  },
  contenedorNumero: {
    flex: 1
  },
  textoNumero: {
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: -4,
    backgroundColor: 'transparent',
    color: 'black'
  },
  textoEstado: {
    backgroundColor: 'transparent',
    color: 'black'
  },
  textoFecha: {
    fontSize: 14,
    marginTop: 2,
    backgroundColor: 'transparent',
    color: 'black'
  },
});