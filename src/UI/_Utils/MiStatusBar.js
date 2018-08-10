import React from "react";
import {
    StatusBar
} from "react-native";

export default class MiStatusBar extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const initData = global.initData;
        const barStyle = initData.statusBarDark ? "light-content" : "dark-content";

        return (
            <StatusBar backgroundColor={initData.statusBarBackgroundColor} barStyle={barStyle} />
        );
    }
}