import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

function UdaciSlider({ max, unit, step, value, onChange }) {
  return (
    <View>
      <Slider
        value={value}
        step={step}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
      />
      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  );
}

export default UdaciSlider;
