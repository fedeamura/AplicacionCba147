import React from "react";
import {
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import {
  Text,
} from "native-base";
import {
  Checkbox
} from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';

//Mis componentes
import App from "@UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiCardDetalle from '@Utils/MiCardDetalle';

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class AjustesDesarrolladores extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      betaTester: false
    };
  }

  componentWillMount() {
    Rules_Ajustes.isBetaTester().then((betaTester) => {
      this.setState({ betaTester: betaTester });
    });
  }

  onBetaTesterClick = () => {
    Rules_Ajustes.setBetaTester(!this.state.betaTester).then(() => {
      this.setState({ betaTester: !this.state.betaTester });
    });
  }

  cerrar = ()=>{
    App.goBack();
  }
  
  render() {
    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo='Ajustes para desarrolladores' onBackPress={this.cerrar} />

        <View style={styles.contenedor}>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* General  */}
            <MiCardDetalle padding={false}>

              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <MiItemDetalle
                  style={{ padding: 16, flex: 1 }}
                  onPress={this.onBetaTesterClick}
                  titulo="Beta test"
                  subtitulo={this.state.betaTester ? 'Haga click aquí para dejar de ser beta tester' : 'Haga click aquí para ser beta tester'} />

                <View style={{ minWidth: 48, minHeight: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                  <Checkbox
                    checked={this.state.betaTester}
                    color="green"
                    onPress={() => { }}
                  />
                </View>

                <View style={{ width: 16 }} />
              </View>

            </MiCardDetalle>
          </ScrollView>
          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>



      </View >
    );
  }

}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
  },
  contenido: {
    flex: 1
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
})