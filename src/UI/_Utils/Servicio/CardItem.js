import React, { Component } from "react";
import { View, Animated, Dimensions } from "react-native";

//Mis compontentes
import App from "@UI/App";
import { Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ServicioCardItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={
        [
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          },
          this.props.style || {}
        ]
      }>
        <Card
          style={
            [
              {
                width: 72,
                height: 72,
                margin: 8,
                borderRadius: 200
              },
              this.props.cardStyle || {}
            ]
          }
          onPress={this.props.onPress}
        >
          <CardContent
            style={
              [
                {
                  backgroundColor: 'white',
                  borderRadius: 200,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              ]
            }>
            {this.props.icono != undefined && (
              <Icon
                name={this.props.icono}
                style={
                  [
                    {
                      backgroundColor: 'transparent',
                      color: 'black',
                      fontSize: 48
                    },
                    this.props.iconoStyle
                  ]
                } />
            )}
          </CardContent>
        </Card>
        {this.props.texto != undefined && (
          <Text
            numberOfLines={this.props.textoLines || 2}
            style={
              [
                {
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  fontSize: 22,
                  maxWidth: 72,
                  marginTop: 4
                },
                this.props.textoStyle || {}
              ]
            }>{this.props.texto}</Text>
        )}
      </View>

    );
  }
}

