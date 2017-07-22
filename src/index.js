
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

export default class AnimationExample extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get('window');
    const edgeLength = 100;

    const axisX = (width / 2) - (edgeLength / 2);
    const axisY = (height / 2) - (edgeLength / 2);

    this.axisX = axisX;
    this.axisY = axisY;



    this.axisXDefault = axisX;
    this.axisYDefault = axisY;

    this.state = {
      coordX: 0,
      coordY: 0,
      axisX,
      axisY,
      edgeLength,
      panAnimation: new Animated.ValueXY({ x: axisX , y: axisY }),
      scaleAnimation: new Animated.Value(1),
    }
  }

  componentWillMount() {
    this.state.panAnimation.x.addListener((event) => {this.axisX = event.value; this.calculatePower({x: event.value, y: this.axisY})});
    this.state.panAnimation.y.addListener((event) => {this.axisY = event.value; this.calculatePower({y: event.value, x: this.axisX})});

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e) => {
        this.state.panAnimation.setOffset({ x: this.axisX, y: this.axisY });
        this.state.panAnimation.setValue({ x: 0, y: 0 });
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1.5,
        }).start();
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.panAnimation.x, dy: this.state.panAnimation.y },
      ]),
      onPanResponderRelease: () => {
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1,
        }).start();

        const { width, height } = Dimensions.get('window');
        const edgeLength = 100;

        const axisX = (width / 2) - (edgeLength / 2);
        const axisY = (height / 2) - (edgeLength / 2);

        this.state.panAnimation.setValue({ x: 0, y: 0 });
      }
    });
  };

  componentWillUnmount() {
    this.state.panAnimation.x.removeAllListeners();
    this.state.panAnimation.y.removeAllListeners();
  };

  componentDidMount(){
  }

  calculatePower = ({x, y}) => {
    const coordX = x - this.axisXDefault
    const coordY = y - this.axisYDefault
    console.log({coordX, coordY})
  }

  render() {
    const { edgeLength, panAnimation, coordX, coordY } = this.state;

    // this.calculatePower()


    const styles = {
      height: edgeLength,
      width: edgeLength,
      backgroundColor: 'blue',
      transform: [
        { translateX: panAnimation.x },
        { translateY: panAnimation.y },
        { scaleX: this.state.scaleAnimation },
        { scaleY: this.state.scaleAnimation },
      ]
    };

    return (
      <View style={styles.container}>
        <Animated.View
          style={styles}
          {...this.panResponder.panHandlers}
        />
        <Text>
         x {coordX}

        </Text>
        <Text>
          y {coordY}
        </Text>
        {/*<Text>*/}
          {/*{this.state.panAnimation && this.state.panAnimation.y}*/}
        {/*</Text>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('bbcar', () => AnimationExample);
