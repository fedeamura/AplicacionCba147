import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Platform
} from "react-native";
import {
  ListItem,
  Text,
  Button,
  Input
} from "native-base";
import { Toolbar, ToolbarContent, ToolbarAction } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Mis compontenes
import App from "@UI/App";
import MiToolbar from "@Utils/MiToolbar";
import MiListado from "@Utils/MiListado";

export default class MiPicker extends React.Component {
  constructor(props) {
    super(props);

    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    if (!('busqueda' in params)) {
      params.busqueda = false;
    }

    if (!('cumpleBusqueda' in params)) {
      params.cumpleBusqueda = () => { return true };
    }

    this.state = {
      busqueda: undefined
    }
  }

  onChangeBusqueda(text) {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    this.setState({
      busqueda: text,
      dataFiltrada: params.data.filter(element => params.cumpleBusqueda(element, text))
    });
  }

  render() {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    let hToolbar = 72;
    let paddingToolbar = Platform.OS == 'ios' ? 20 : 0;

    return (
      <View style={styles.contenedor}>
        {params.busqueda ? (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: paddingToolbar, height: hToolbar }}>

            <Icon name="magnify" style="MaterialCommunityIcons" style={{ fontSize: 32 }} />
            <TextInput
              onChangeText={text => { this.onChangeBusqueda(text); }}
              placeholder={params.placeholderBusqueda || 'Buscar'}
              underlineColorAndroid='rgba(0,0,0,0)'
              style={{ marginLeft: 16 , fontSize:20}} />
          </View>

        ) : (
            <Button
              onPress={() => {
                App.goBack();
              }}
              transparent
              style={{ position: 'absolute', left: 16, top: 10 + 20 }}><Icon name="close" style={{ fontSize: 24 }} />
            </Button>
          )}


        {/* <MiToolbar
          dark={false}
          style={{ backgroundColor: 'white' }}
          left={{
            icon: "arrow-back",
            onClick: () => {
              App.goBack();
            }
          }}
        >

          {params.busqueda && (
            <View style={styles.contenedorBusqueda}>
              <TextInput
                onChangeText={text => { this.onChangeBusqueda(text); }}
                placeholder={params.placeholderBusqueda}
                underlineColorAndroid='rgba(0,0,0,0)'
                style={styles.inputBusqueda} />
            </View>

          )}

        </MiToolbar> */}
        <View style={{ width: '100%', flex: 1 }}>
          <MiListado
            data={this.state.busqueda != undefined && this.state.busqueda != "" ? this.state.dataFiltrada : params.data}
            keyExtractor={params.keyExtractor}
            cargando={false}
            renderEmpty={() => {
              return <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Text>Servicio no encontrado</Text></View>;
            }}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => {
                  params.onPress(item);
                  App.goBack();
                }}
              >
                <Text>{params.title(item)}</Text>
              </ListItem>
            )}
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    height: "100%",
    width: "100%",
    backgroundColor: "white"
  },
  contenedorBusqueda: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  inputBusqueda: {
    width: '100%',
    fontSize: 20
  }
});
