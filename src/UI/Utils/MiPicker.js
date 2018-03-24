import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput
} from "react-native";
import {
  ListItem,
  Text
} from "native-base";
import { Toolbar, ToolbarContent, ToolbarAction } from "react-native-paper";

//Mis compontenes
import AppStyles from "Cordoba/src/UI/Styles/default";
import MiToolbar from "Cordoba/src/UI/Utils/MiToolbar";
import MiListado from "Cordoba/src/UI/Utils/MiListado";

export default class MiPicker extends React.Component {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

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
    const { params } = this.props.navigation.state;

    this.setState({
      busqueda: text,
      dataFiltrada: params.data.filter(element => params.cumpleBusqueda(element, text))
    });
  }

  render() {
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.contenedor}>
        <MiToolbar
          dark={false}
          style={{ backgroundColor: 'white' }}
          left={{
            icon: "arrow-back",
            onClick: () => {
              goBack();
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

        </MiToolbar>
        <MiListado
          style={styles.listado}
          data={this.state.busqueda != undefined && this.state.busqueda != "" ? this.state.dataFiltrada : params.data}
          keyExtractor={params.keyExtractor}
          cargando={false}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => {
                params.onPress(item);
                goBack();
              }}
            >
              <Text>{params.title(item)}</Text>
            </ListItem>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    height: "100%",
    width: "100%",
    backgroundColor: global.styles.colorFondo
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
  },
  listado: {
    flex:1,
    backgroundColor: global.styles.colorFondo
  }
});
