import React from "react";
import { AppRegistry, Text } from "react-native";
import codePush from "react-native-code-push";

//Mi App
import App from "Cordoba/src/UI/App";

AppRegistry.registerComponent('Cordoba', () =>
    codePush({ checkFrequency: codePush.CheckFrequency.MANUAL })(App)
);

