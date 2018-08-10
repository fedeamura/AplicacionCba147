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
      animando: false,
      valor: props.valorInicial,
      error: undefined
    };

    this.timer = undefined;
    this.animError = new Animated.Value(0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  onChange = (val) => {
    this.setState({
      valor: val,
      error: validar(val, this.props.validaciones || {})
    }, function () {
      this.informarVal();
      this.informarTieneAlgo();
      this.informarError();
      this.animarError();
    }.bind(this));
  }

  animarError = () => {
    clearTimeout(this.timerAnim);
    this.timerAnim = setTimeout(() => {
      let nextValue = this.state.error != undefined ? 1 : 0;
      if (this.animarError._value == nextValue) return;

      Animated.timing(this.animError, {
        toValue: nextValue,
        duration: 500
      }).start();

    }, 300);
  }

  informarVal = () => {
    if (this.props.onChange != undefined) {
      this.props.onChange(this.state.valor);
    }
  }

  informarError = () => {
    if (this.props.onError != undefined) {
      this.props.onError(this.state.error != undefined);
    }
  }

  informarTieneAlgo = () => {
    let tieneAlgo = this.state.valor != undefined || this.state.valor != "";
    if (this.props.tieneAlgo != undefined) {
      this.props.tieneAlgo(tieneAlgo);
    }
  }

  onRef = (ref) => {
    if (this.props.onRef != undefined) {
      this.props.onRef(ref);
    }
  }


  render() {
    return (
      <View style={[{}, this.props.style]}>
        <Item error={this.state.error != undefined}>
          <Input
            ref={this.onRef}
            secureTextEntry={this.props.secureTextEntry}
            returnKeyType={this.props.returnKeyType}
            onSubmitEditing={this.props.onSubmitEditing}
            autoCapitalize={this.props.autoCapitalize}
            autoCorrect={this.props.autoCorrect}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            value={this.state.valor != undefined ? ("" + this.state.valor) : ''}
            onChangeText={this.onChange} />
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