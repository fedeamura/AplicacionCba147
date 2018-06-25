import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Text
} from "react-native";

export default class MiListado extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mostrandoError: false,
      mostrandoEmpty: false,
    };

    // this.anim_Cargando = new Animated.Value(0);
    this.anim_Empty = new Animated.Value(0);
    this.anim_Error = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    let empty = false;
    let error = false;

    if ('error' in nextProps && nextProps.error == true) {
      error = true;
      this.mostrarError();
    } else {
      this.ocultarError();

      if (!('data' in nextProps) || nextProps.data.length == 0) {
        if ('refreshing' in nextProps && nextProps.refreshing == true) {
          this.ocultarEmpty();
        } else {
          empty = true;
          this.mostrarEmpty();
        }
      } else {
        this.ocultarEmpty();
      }
    }


    this.setState({
      // mostrandoCargando: cargando,
      mostrandoEmpty: empty,
      mostrandoError: error
    });
  }

  mostrarError = () => {
    Animated.timing(this.anim_Error, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarError = () => {
    Animated.timing(this.anim_Error, {
      duration: 500,
      toValue: 0
    }).start();
  }

  mostrarEmpty = () => {
    Animated.timing(this.anim_Empty, {
      duration: 500,
      toValue: 1
    }).start();
  }

  ocultarEmpty = () => {
    Animated.timing(this.anim_Empty, {
      duration: 500,
      toValue: 0
    }).start();
  }


  render() {

    const colorFondo = this.props.backgroundColor || 'white';

    //Empty
    let viewEmpty;
    if ('renderEmpty' in this.props && this.props.renderEmpty != undefined) {
      viewEmpty = this.props.renderEmpty();
    } else {
      viewEmpty = (
        <View style={[styles.contenedor_Empty, { backgroundColor: colorFondo }]}>
          <Text>Sin items</Text>
        </View>
      );
    }


    //Error
    let viewError;
    if ('renderError' in this.props && this.props.renderError != undefined) {
      viewError = this.props.renderError();
    } else {
      viewError = (
        <View style={[styles.contenedor_Error, { backgroundColor: colorFondo }]}>
          <Text>{this.props.error}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.contenedor, { backgroundColor: colorFondo }]}>

        {/* Listado */}
        <FlatList
          ref={(ref) => {
            if (this.props.refListado == undefined) return;
            this.props.refListado(ref);
          }}
          style={[styles.listado]}
          data={this.props.data}
          contentContainerStyle={this.props.style}
          keyExtractor={this.props.keyExtractor}
          renderItem={item => {
            return this.props.renderItem(item);
          }}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.refreshing}
        />

        {/* Error */}
        <Animated.View
          pointerEvents={this.state.mostrandoError ? "auto" : "none"}
          style={[styles.contenedor_Error, {
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
          style={[styles.contenedor_Empty, {
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
    flex: 1,
    display: 'flex'
  },
  listado: {
    width: '100%',
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  contenedor_Empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contenedor_Error: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

