import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Animated
} from "react-native";
import { FAB } from "react-native-paper";

//Mis compontentes
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";

var i = 0;
export default class MiFAB extends React.Component {
  constructor(props) {
    super(props);


    this.anim = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }

  mostrar() {
    Animated.spring(this.anim, {
      toValue: 1
    }).start();
  }

  ocultar() {
    Animated.spring(this.anim, {
      toValue: 0
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          opacity: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp'

          }),
          transform:
            [{
              scale: this.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }]

        }}
      >
        <FAB
          pointerEvents={this.props.visible ? 'auto' : 'none'}
          icon={this.props.icon}
          onPress={() => {
            this.props.onPress();
          }}
          style={AppTheme.Styles.fab}
        />
      </Animated.View>

    );
  }
}


const styles = StyleSheet.create({

});

