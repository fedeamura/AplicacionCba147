import React from "react";
import {
  Animated,
  View
} from "react-native";

export default class MiView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      render: props.visible,
      animando: false,
      visible: props.visible
    };

    this.anim = new Animated.Value(props.visible ? 1 : 0);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    onVisibilyChange: () => { },
    visible: true,
    height: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.visible != nextProps.visible) {
      this.setState({
        visible: nextProps.visible,
        render: true,
        animando: true
      }, () => {
        if (nextProps.visible == true) {
          this.props.onVisibilyChange(true);
        }

        Animated.timing(this.anim, {
          toValue: nextProps.visible == true ? 1 : 0,
          duration: 300
        }).start(() => {
          if (nextProps.visible == false) {
            this.setState({
              render: false,
              animando: false
            }, () => {
              //Informo
              this.props.onVisibilyChange(false);
            });
          } else {
            this.setState({ animando: false })
          }

        });
      });
    }
  }

  render() {
    if (this.state.render == false) return null;

    const style = {};
    style.opacity = this.anim;
    if (this.props.height == true) {
      style.maxHeight = this.anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000]
      });
    }

    return <View>
      <Animated.View style={style} pointerEvents={this.state.visible ? 'auto' : 'none'}>
        {this.props.children}
      </Animated.View>
    </View>
  }
}
