import React, { Component } from "react";
import {
  View,
  StyleSheet
} from "react-native";
import { Text } from "native-base";
import { TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from "react-native-paper";

//Mis componentes
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";

export default class MiToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let left = <View />;
    if (this.props.left != undefined) {
      left = (
        <ToolbarAction
          icon={this.props.left.icon}
          onPress={() => {
            if (this.props.left.onClick != undefined) {
              this.props.left.onClick();
            }
          }}
        />
      );
    }

    let center = <ToolbarContent />;

    let right = undefined;
    if (this.props.right != undefined && this.props.right.lenght != 0) {
      right = this.props.right.map((item, index) => {
        return (
          <ToolbarAction
            key={index}
            icon={item.icon}
            onPress={() => {
              if (item.onClick != undefined) {
                item.onClick();
              }
            }}
          />
        );
      });
    }
    return (
      <Toolbar
        dark={global.styles.toolbarDark ? true : this.props.dark}
        style={[AppTheme.Styles.Toolbar, this.props.style]}>
        {left}
        {this.props.children != undefined ? this.props.children : center}
        {right}
      </Toolbar >
    );
  }
}