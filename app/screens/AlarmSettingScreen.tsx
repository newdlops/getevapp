import React from 'react';
import { View, Text, Button, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import RichTextEditor from '../../specs/RichTextEditorNativeComponent.ts';


const AlarmSettingScreen: React.FC = () => {
  const [text, setText] = React.useState('Hello, *world*!');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*<RichTextEditor style={{height:200, width: 200}}></RichTextEditor>*/}
      <RichTextEditor style={{flex:1}}></RichTextEditor>
      {/*<RichText editor={editor} />*/}
      {/*<KeyboardAvoidingView*/}
      {/*  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}*/}
      {/*  style={{*/}
      {/*    position: 'absolute',*/}
      {/*    width: '100%',*/}
      {/*    bottom: 0,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Toolbar editor={editor} />*/}
      {/*</KeyboardAvoidingView>*/}
    </SafeAreaView>
  );
};

export default AlarmSettingScreen;
