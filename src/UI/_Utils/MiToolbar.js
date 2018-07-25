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

  static defaultProps = {
    ...React.Component.defaultProps,
    mostrarBotonBack: true,
    onBackPress: () => { },
    customContent: undefined
  }

  render() {
    const initData = global.initData;
    const backgroundColor = this.props.backgroundColor || initData.toolbar_BackgroundColor;
    const dark = this.props.dark || initData.toolbar_Dark;
    return (
      <Toolbar style={[styles.toolbar, {
        backgroundColor: backgroundColor,
        height: initData.toolbar_Height
      }, this.props.style]}
        elevation={0}
        dark={dark}>

        {this.props.mostrarBotonBack == true && (
          <ToolbarBackAction
            onPress={this.props.onBackPress}
          />
        )}

        {this.props.customContent == undefined && (
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