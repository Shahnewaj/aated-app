import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { persistor, store } from './lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './navigation/AppNavigation';

const App = () => {
  if (__DEV__) {
    // require('../ReactotronConfig');
  }
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigation />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
