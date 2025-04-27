import type {HostComponent, ViewProps} from 'react-native';
import type {BubblingEventHandler, DirectEventHandler, Int32} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type WebViewScriptLoadedEvent = {
  result: 'success' | 'error';
};

export interface NativeProps extends ViewProps {
  sourceURL?: string;
  onScriptLoaded?: BubblingEventHandler<WebViewScriptLoadedEvent> | null;
  // 텍스트 변경 시 호출될 이벤트 핸들러
  onTextChange?: DirectEventHandler<{ text: string }>;
  height?: Int32;
  maxLines?: Int32;
  minLines?: Int32;
  minHeight?: Int32;
}

export default codegenNativeComponent<NativeProps>(
  'RichTextEditor',
) as HostComponent<NativeProps>;
