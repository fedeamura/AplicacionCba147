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
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";

export default class MiListado extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mostrandoError: false,
      mostrandoEmpty: false,
      mostrandoCargando: false
    };

    this.anim_Cargando = new Animated.Value(0);
    this.anim_Empty = new Animated.Value(0);
    this.anim_Error = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    let cargando = false;
    let empty = false;
    let error = false;

    if ('cargando' in nextProps && nextProps.cargando == true) {
      cargando = true;
      this.mostrarCargando();
    } else {
      this.ocultarCargando();

      if ('error' in nextProps && nextProps.error != undefined) {
        error = true;
        this.mostrarError();
      } else {
        this.ocultarError();

        if (!('data' in nextProps) || nextProps.data.length == 0) {
          empty = true;
          this.mostrarEmpty();
        } else {
          this.ocultarEmpty();
        }
      }
    }

    this.setState({
      mostrandoCargando: cargando,
      mostrandoEmpty: empty,
      mostrandoError: error
    });
  }

  mostrarCargando() {
    Animated.timing(this.anim_Cargando, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarCargando() {
    Animated.timing(this.anim_Cargando, {
      duration: 500,
      toValue: 0
    }).start();
  }

  mostrarError() {
    Animated.timing(this.anim_Error, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarError() {
    Animated.timing(this.anim_Error, {
      duration: 500,
      toValue: 0
    }).start();
  }

  mostrarEmpty() {
    Animated.timing(this.anim_Empty, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarEmpty() {
    Animated.timing(this.anim_Empty, {
      duration: 500,
      toValue: 0
    }).start();
  }


  render() {

    //Cargando
    let viewCargando;
    if (this.props.renderCargando != undefined) {
      viewCargando = this.props.renderCargando();
    } else {
      viewCargando = (
        <View style={{
          width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
        }}>
          <Spinner color="black" />
        </View>

      );
    }

    //Empty
    let viewEmpty;
    if (this.props.renderEmpty != undefined) {
      viewEmpty = this.props.renderEmpty();
    } else {
      viewEmpty = (
        <View style={{
          width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
        }}>
          <Text>Sin items</Text>
        </View>
      );
    }


    //Error
    let viewError;
    if (this.props.renderError != undefined) {
      viewError = this.props.renderError();
    } else {
      viewError = (
        <View style={{
          width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
        }}>
          <Text>{this.props.error}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.contenedor, this.props.style]}>

        {/* Listado */}
        <FlatList
          ref={(ref) => {
            if (this.props.refListado == undefined) return;
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
          pointerEvents={this.state.mostrandoCargando ? "auto" : "none"}
          style={
            [
              {
                width: '100%',
                height: '100%',
                position: 'absolute'
              },
              {
                opacity: this.anim_Cargando.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]}>
          {viewCargando}
        </Animated.View>

        {/* Error */}
        <Animated.View
          pointerEvents={this.state.mostrandoError ? "auto" : "none"}
          style={
            [
              {
                width: '100%',
                height: '100%',
                position: 'absolute'
              },
              {
                opacity: this.anim_Error.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]}>
          {viewError}
        </Animated.View>

        {/* Empty */}
        <Animated.View
          pointerEvents={this.state.mostrandoEmpty ? "auto" : "none"}
          style={
            [
              {
                width: '100%',
                height: '100%',
                position: 'absolute'
              },
              {
                opacity: this.anim_Empty.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]}>
          {viewEmpty}
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
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
});

