import React from 'react';
import {StyleSheet, TextInput, View, type ViewProps} from 'react-native';

type NativeTextChangeEvent = {
  nativeEvent: {
    text: string;
  };
};

export interface NativeProps extends ViewProps {
  sourceURL?: string;
  onTextChange?: ((event: NativeTextChangeEvent) => void) | null;
  height?: number;
  maxLines?: number;
  minLines?: number;
  minHeight?: number;
}

export default function RichTextEditor(props: NativeProps) {
  const [text, setText] = React.useState('');

  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        multiline
        placeholder="iOS에서는 RichTextEditor 네이티브 컴포넌트가 구현되어 있지 않습니다."
        style={[
          styles.input,
          props.height != null && {height: props.height},
          props.minHeight != null && {minHeight: props.minHeight},
        ]}
        value={text}
        onChangeText={nextText => {
          setText(nextText);
          props.onTextChange?.({nativeEvent: {text: nextText}});
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  input: {flex: 1, textAlignVertical: 'top'},
});

