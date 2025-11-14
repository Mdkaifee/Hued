/**
 * @format
 */

import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';

// Reanimated normally injects a native `_toString` helper; provide a safe JS
// fallback so Hermes doesn't crash if the native global is missing during init.
if (typeof global._toString !== 'function') {
  global._toString = value => {
    try {
      if (value === null) {
        return 'null';
      }
      if (value === undefined) {
        return 'undefined';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value?.toString === 'function') {
        return value.toString();
      }
      return Object.prototype.toString.call(value);
    } catch (error) {
      return '[unserializable]';
    }
  };
}

LogBox.ignoreLogs([
  '[GESTURE HANDLER] Tearing down gesture handler registered for root view',
]);
AppRegistry.registerComponent(appName, () => App);
