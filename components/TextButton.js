import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { purple } from '../utils/colors';

function TextButton({ children, onPress, style = {} }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.reset, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

/* Styles */

const styles = StyleSheet.create({
  reset: {
    color: purple,
    textAlign: 'center',
  },
});

export default TextButton;
