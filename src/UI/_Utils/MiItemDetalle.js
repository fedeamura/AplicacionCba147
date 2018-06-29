import React from "react";
import {
  View
} from "react-native";
import {
  Text
} from "native-base";
import WebImage from 'react-native-web-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableRipple } from "react-native-paper";

export default class MiItemDetalle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }


  render() {
    return (
      <TouchableRipple onPress={this.props.onPress}>
        <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }, this.props.style]}>
          {this.props.icono != undefined && (
            <Icon style={{
              opacity:0.8,
              fontSize: 24,
              marginRight: 16,
              alignSelf: this.props.iconoAlign || 'center'
            }}
              name={this.props.icono} />
          )}

          <View>
            {this.props.titulo != undefined && (
              <Text style={{ fontWeight: 'bold' }}>{this.props.titulo}</Text>
            )}
            {this.props.subtitulo != undefined && (
              <Text style={{}}>{this.props.subtitulo}</Text>
            )}
          </View>
        </View>
      </TouchableRipple>

    );
  }
}