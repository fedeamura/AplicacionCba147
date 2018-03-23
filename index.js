import { AppRegistry, Platform } from 'react-native';
import App from "Cordoba/src/UI/App";

import codePush from "react-native-code-push";
let deploymentKey = Platform.OS == 'ios' ? 'PfHTHuI72bZjyvJHN7-1mPEBLFxsrkFMKlHdf' : 'yRjO-uUfAoarYJSJWHdTV1P5LYXmHyiWzMHdf';

AppRegistry.registerComponent('Cordoba', () =>
    codePush({
        deploymentKey: deploymentKey,
        installMode: codePush.InstallMode.ON_NEXT_RESUME,
        mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESUME
    })(App)
);
