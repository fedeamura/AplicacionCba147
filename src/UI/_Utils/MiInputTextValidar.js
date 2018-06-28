import React from "react";
import {
  View,
  Animated,
} from "react-native";
import {
  Text,
  Input,
  Item,
} from "native-base";
import { validar } from '@Utils/MiValidador'

export default class MiInputTextValidar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      valor: props.valorInicial,
      error: undefined
    };

    this.timer = undefined;
    this.animError = new Animated.Value(0);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  onValorChange = (val) => {
    this.setState({
      valor: val
      // error: this.validar(val)
    }, () => {
      // this.animarError();
      this.informarVal();
      // this.informarError();
      this.informarTieneAlgo();

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.validarError();
      }, 300);
    });
  }

  validarError = () => {
    this.setState({
      // valor: val
      error: this.validar(this.state.valor)
    }, () => {
      this.animarError();
      // this.informarVal();
      this.informarError();
      // this.informarTieneAlgo();
    });
  }

  animarError() {
    let nextValue = this.state.error != undefined ? 1 : 0;
    if (this.animarError._value == nextValue) return;

    Animated.timing(this.animError, {
      toValue: nextValue,
      duration: 500
    }).start();
  }

  validar(val) {
    return validar(val, this.props.validaciones || {});
  }

  informarVal() {
    if (this.props.onChange != undefined) {
      this.props.onChange(this.state.valor);
    }
  }

  informarError() {
    if (this.props.onError != undefined) {
      this.props.onError(this.state.error != undefined);
    }
  }

  informarTieneAlgo() {
    let tieneAlgo = this.state.valor != undefined || this.state.valor != "";
    if (this.props.tieneAlgo != undefined) {
      this.props.tieneAlgo(tieneAlgo);
    }
  }


  render() {
    return (
      <View style={[{}, this.props.style]}>
        <Item error={this.state.error != undefined}>
          <Input
            ref={(ref) => {
              if (this.props.onRef != undefined) {
                this.props.onRef(ref);
              }
            }}
            onFocusOut={this.onFocusOut}
            secureTextEntry={this.props.secureTextEntry}
            returnKeyType={this.props.returnKeyType}
            onSubmitEditing={this.props.onSubmitEditing}
            autoCapitalize={this.props.autoCapitalize}
            autoCorrect={this.props.autoCorrect}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            value={this.state.valor != undefined ? ("" + this.state.valor) : ''}
            onChangeText={(val) => { this.onValorChange(val) }} />
        </Item>

        <Animated.View style={{
          opacity: this.animError,
          maxHeight: this.animError.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40]
          })
        }}>
          <Text
            numberOfLines={1}
            style={{ marginLeft: 4, marginTop: 4, fontSize: 16, color: 'red', fontWeight: 'bold', marginBottom: 8 }}>
            {this.state.error || '   '}
          </Text>
        </Animated.View>

      </View>
    );
  }
}