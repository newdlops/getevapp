// app/index.js
import React from 'react';
import App from './App';
import { Provider } from 'react-redux';
import {store} from './store/store';

// 여기서 추가적으로 초기화 로직이나 HOC를 감싸는 작업 등을 할 수 있습니다.
// 예: ErrorBoundary, PerfLogger, Sentry.init() 등
// 하지만 단순히 App을 export만 하는 경우도 많습니다.

export default function AppEntryPoint() {
  // 예: ErrorBoundary로 감싼다고 가정
  // return (
  //   <ErrorBoundary>
  //     <App />
  //   </ErrorBoundary>
  // );

  return <Provider store={store}><App /></Provider>;
}
