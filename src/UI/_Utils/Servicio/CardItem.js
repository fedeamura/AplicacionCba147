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
    const w = (Dimensions.get('window').width - 72) / this.props.cols;
    const wCard = 104;

    return (
      <View style={{width: w,height: w, display:'flex', justifyContent:'center', alignItems:'center', marginBottom:16}}>
        <Card style={[{width:wCard,height: wCard, margin:8, borderRadius:200}]} onPress={()=>{this.props.onPress()}}>
          <CardContent style={{backgroundColor: 'rgba(0,0,0,0.1)',borderRadius:200, height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Icon name="flash" style={{fontSize:56, backgroundColor:'transparent'}}/>
          </CardContent>
        </Card>
        <Text style={{backgroundColor:'transparent', fontSize:22, marginTop:4}}>Hola</Text>
      </View>

    );
  }
}

