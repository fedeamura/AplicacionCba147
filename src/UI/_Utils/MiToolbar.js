import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from "react-native-paper";


export default class MiToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const initData = global.initData;
    return (
      <Toolbar style={[styles.toolbar, {
        backgroundColor: initData.toolbar_BackgroundColor,
        height: initData.toolbar_Height
      }, this.props.style]}
        elevation={0}
        dark={initData.toolbar_Dark}>

        <ToolbarBackAction
          onPress={this.props.onBackPress}
        />

        {!('customContent' in this.props) && (
          <ToolbarContent title={this.props.titulo || ''} subtitle={this.props.subtitulo} />
        )}

        {this.props.children}

      </Toolbar>);
  }
}


const styles = StyleSheet.create({
  toolbar: {

  }
})