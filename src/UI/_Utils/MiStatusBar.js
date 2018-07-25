import React from "react";
import {
    StatusBar
} from "react-native";

export default class MiStatusBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const initData = global.initData;
        const barStyle = initData.statusBar_Dark ? "light-content" : "dark-content";

        return (
            <StatusBar backgroundColor={initData.statusBar_BackgroundColor} barStyle={barStyle} />
        );
    }
}