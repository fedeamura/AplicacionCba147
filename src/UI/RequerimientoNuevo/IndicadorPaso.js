import React, { Component } from "react";
import {
  Platform,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Content
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
    this.animPress = new Animated.Value(0);
    this.animResaltado = new Animated.Value(props.resaltado ? 1 : 0);
    this.animCompletado = new Animated.Value(props.completado ? 1 : 0);

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    //Completado
    Animated.timing(this.animCompletado, {
      duration: 300,
      toValue: nextProps.completado ? 1 : 0
    }).start();

    //Resaltado
    Animated.timing(this.animResaltado, {
      duration: 300,
      toValue: nextProps.resaltado ? 1 : 0
    }).start();
  }

  onPressIn() {
    Animated.spring(this.animPress, {
      toValue: 1
    }).start();
  }

  onPressOut() {
    Animated.spring(this.animPress, {
      toValue: 0
    }).start();
  }

  render() {

    const initData = global.initData.requerimientoNuevo;

    return (
      <TouchableWithoutFeedback
        onPressIn={() => {
          this.onPressIn();
        }}
        onPressOut={() => {
          this.onPressOut();
        }}
        onPress={this.props.onPress}>

        <Animated.View
          style={{
            opacity: this.animPress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.7]
            }),
            transform: [
              {
                scale: this.animPress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9]
                })
              },
              {
                translateX: this.animPress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                })
              }
            ]
          }}
        >

          <Animated.View
            style={{
              // opacity: this.animResaltado.interpolate({
              //   inputRange: [0, 1],
              //   outputRange: [0.7, 1]
              // }),
              transform: [
                {
                  scale: this.animResaltado.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                },
                {
                  translateX: this.animResaltado.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-33, 0]
                  })
                }
              ]
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Animated.View style={{
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowRadius: 10,
                shadowOpacity: 1,
                width: 48,
                height: 48,
                backgroundColor: this.animCompletado.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.props.colorFondoCirculo || 'white', this.props.colorFondoCirculoCompletado || 'green']
                }),
                // borderWidth: this.props.anchoBordeCirculo || 2,
                // borderColor: this.props.colorBordeCirculo || 'green',
                borderRadius: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Animated.Text
                  style={{
                    backgroundColor: 'transparent',
                    color: this.animCompletado.interpolate({
                      inputRange: [0, 1],
                      outputRange: [this.props.colorTextoCirculo || 'green', this.props.colorTextoCirculoCompletado || 'white']
                    }),
                    fontSize: this.props.fontSizeCirculo || 32
                  }}>
                  {this.props.numero || '1º'}
                </Animated.Text>
              </Animated.View>
              <Text style={{ fontSize: 26, marginLeft: 8 }}>{this.props.texto || 'paso'}</Text>

            </View >
          </Animated.View>
        </Animated.View>

      </TouchableWithoutFeedback >

    );
  }
}