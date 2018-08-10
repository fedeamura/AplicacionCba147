import React from "react";
import {
  StyleSheet
} from "react-native";
import { Toolbar, ToolbarBackAction, ToolbarContent } from "react-native-paper";


export default class MiToolbar extends React.PureComponent {

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
    const backgroundColor = this.props.backgroundColor || initData.toolbarBackgroundColor;
    const dark = this.props.dark || initData.toolbarDark;
    return (
      <Toolbar style={[styles.toolbar, {
        backgroundColor: backgroundColor,
        height: initData.toolbarHeight
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