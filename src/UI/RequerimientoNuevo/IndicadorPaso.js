import React from "react";
import {
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import {
  Text, Spinner,
} from "native-base";
import autobind from 'autobind-decorator'

export default class RequerimientoNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.animPress = new Animated.Value(0);
    this.animCompletado = new Animated.Value(props.completado ? 1 : 0);
    this.animCargando = new Animated.Value(0);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    //Completado
    Animated.timing(this.animCompletado, {
      duration: 300,
      toValue: nextProps.completado ? 1 : 0
    }).start();

    Animated.timing(this.animCargando, {
      duration: 300,
      toValue: nextProps.cargando == true ? 1 : 0
    }).start();
  }

  @autobind
  onPressIn() {
    Animated.spring(this.animPress, {
      toValue: 1
    }).start();
  }

  @autobind
  onPressOut() {
    Animated.spring(this.animPress, {
      toValue: 0
    }).start();
  }

  render() {

    let colorCirculo = this.props.colorFondoCirculo || 'white';
    let colorCirculoCompletado = this.props.colorFondoCirculoCompletado || 'green';

    return (
      <TouchableWithoutFeedback
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onPress={this.props.onPress}>

        <Animated.View
          style={{
            padding: 16,
            opacity: this.animPress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.5]
            })
          }}
        >

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Animated.View style={{
              width: 32,
              height: 32,
              backgroundColor: this.animCompletado.interpolate({
                inputRange: [0, 1],
                outputRange: [colorCirculo, colorCirculoCompletado]
              }),
              borderWidth: this.props.anchoBordeCirculo || 2,
              borderColor: this.props.colorBordeCirculo || 'green',
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
                  fontSize: this.props.fontSizeCirculo || 24
                }}>
                {this.props.numero || '1º'}
              </Animated.Text>
            </Animated.View>

            {/* Texto */}
            <Text style={{
              flex: 1,
              fontSize: 22,
              marginLeft: 16
            }}>{this.props.texto || 'paso'}</Text>

            {/* Cargando */}
            <Animated.View style={{ opacity: this.animCargando }}>
              <Spinner color="green" style={{ width: 32, height: 32 }} />
            </Animated.View>

          </View >
        </Animated.View>

      </TouchableWithoutFeedback >

    );
  }
}