import { StyleSheet, Text, View } from 'react-native';
import { useReducer } from 'react';
import PropTypes from 'prop-types';

const ReducerTest = () => {
  const [state, dispatch] = useReducer(reducer, init);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReducerTest</Text>
    </View>
  );
};

ReducerTest.propTypes = {
  //PropTypes
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default ReducerTest;
