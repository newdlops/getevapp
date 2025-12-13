/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../app/navigators/RootNavigator', () => {
  const ReactLocal = require('react');
  const {View} = require('react-native');
  const MockRootNavigator = () => ReactLocal.createElement(View, null);
  return {__esModule: true, default: MockRootNavigator};
});

import App from '../app/App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
