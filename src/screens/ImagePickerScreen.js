import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const ImagePickerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ImagePickerScreen</Text>
    </View>
  );
};

ImagePickerScreen.propTypes = {
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

export default ImagePickerScreen;
