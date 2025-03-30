package com.nativespecs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RichTextEditorManagerDelegate
import com.facebook.react.viewmanagers.RichTextEditorManagerInterface

@ReactModule(name = RichEditTextManager.REACT_CLASS)
class RichEditTextManager(reactContext: ReactApplicationContext) : SimpleViewManager<RichEditText>(), RichTextEditorManagerInterface<RichEditText> {
  private val delegate: RichTextEditorManagerDelegate<RichEditText, RichEditTextManager> =
    RichTextEditorManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<RichEditText> = delegate

  override fun getName(): String = REACT_CLASS


//  override fun getName(): String = "RichEditText"

  override fun createViewInstance(reactContext: ThemedReactContext): RichEditText {
    return RichEditText(reactContext, null)
  }

  override fun setSourceURL(view: RichEditText?, value: String?) {
    TODO("Not yet implemented")
  }

  companion object {
    const val REACT_CLASS = "RichTextEditor"
  }

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any>? {
    return super.getExportedCustomBubblingEventTypeConstants()
  }
}