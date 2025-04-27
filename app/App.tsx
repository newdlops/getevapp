// App.js
import React from 'react'
import RootNavigator from './navigators/RootNavigator'
import { DeviceEventEmitter } from 'react-native';

const originalEventEmit = DeviceEventEmitter.emit.bind(DeviceEventEmitter);
DeviceEventEmitter.emit = (eventName, ...args) => {
  console.log('[Native->JS]', eventName, ...args);
  return originalEventEmit(eventName, ...args);
}

export default function App() {
  return <RootNavigator />
}
