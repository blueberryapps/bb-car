import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';

const styles = {
  container: {
    paddingTop: 30
  },
  info:{
    marginBottom: 5
  }
};

class MyComponent extends Component { // no lifecycle needed
  render() {
    const {
      Accelerometer= {},
      Gyroscope = {},
    } = this.props;

    const { x = 0, y = 0 , z = 0 } = Accelerometer;

    // console.log(Gyroscope.x, Accelerometer.x)

    return (
      <View style={styles.container}>
        <Text style={styles.info}>

          x: {parseInt(x * 1000)}
        </Text>
        <Text style={styles.info}>
          y: {parseInt(y * 1000)}
        </Text>
        <Text style={styles.info}>
          z: {parseInt(z * 1000)}
        </Text>
        <Text style={styles.info}>
          timestamp: {Gyroscope.timestamp}
        </Text>
      </View>
    );
  }
}

export default sensors({
  Accelerometer: {
    updateInterval: 300, // optional
  },
  Gyroscope: true,
})(MyComponent);
