import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Text
} from "react-native";
import { Spinner } from "native-base";
import {
  Card,
  CardContent
} from "react-native-paper";

//Mis compontentes
import AppStyles from "Cordoba/src/UI/Styles/default";

var i = 0;
export default class MiListado extends React.Component {
  constructor(props) {
    super(props);
    this.anim = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cargando) {
      this.mostrarCargando();
    } else {
      this.ocultarCargando();
    }
  }

  mostrarCargando() {
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarCargando() {
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 0
    }).start();
  }

  render() {
    return (
      <View style={[styles.contenedor, this.props.style]}>

        {/* Listado */}
        <FlatList
          ref={(ref) => {
            if(this.props.refListado==undefined)return;
            this.props.refListado(ref);
          }}
          style={[styles.listado, this.props.style]}
          data={this.props.data}
          keyExtractor={this.props.keyExtractor}
          renderItem={item => {
            return this.props.renderItem(item);
          }}
        />

        {/* Cargando */}
        <Animated.View
          pointerEvents={this.props.cargando ? "auto" : "none"}
          style={[styles.cargando, {
            opacity: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }]}>

          <Spinner color="black" />

        </Animated.View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  contenedor: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  listado: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  cargando: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

