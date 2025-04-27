package com.nativespecs

import android.graphics.Color
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.LinearLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.facebook.react.touch.JSResponderHandler
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.viewmanagers.RichTextEditorManagerDelegate
import com.facebook.react.viewmanagers.RichTextEditorManagerInterface

@ReactModule(name = RichEditTextManager.REACT_CLASS)
class RichEditTextManager(reactContext: ReactApplicationContext) :
  SimpleViewManager<RichEditText>(), RichTextEditorManagerInterface<RichEditText> {
  private val delegate: RichTextEditorManagerDelegate<RichEditText, RichEditTextManager> =
    RichTextEditorManagerDelegate(this)

  var richEditText: RichEditText? = null

  override fun getDelegate(): ViewManagerDelegate<RichEditText> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(reactContext: ThemedReactContext): RichEditText {
    val editor = RichEditText(reactContext, null)
    editor.imageLauncher = RichEditTextPackage.RichEditTextManagerProvider.imageLauncher
    RichEditTextPackage.RichEditTextManagerProvider.manager = this
    richEditText = editor
    editor.layoutParams =
      LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 300)
    return editor.apply {
      post {
        Log.d("RichEdit", "Measured height: $measuredHeight, editText: ${editor.measuredHeight}")
      }
    }
  }

  override fun setSourceURL(view: RichEditText?, value: String?) {
    TODO("Not yet implemented")
  }

  override fun setHeight(view: RichEditText?, value: Int) {
    view?.editText?.height = value
  }

  override fun setMaxLines(view: RichEditText?, value: Int) {
    view?.editText?.maxLines = value
  }

  override fun setMinHeight(view: RichEditText?, value: Int) {
    view?.editText?.minHeight = value
  }

  override fun setMinLines(view: RichEditText?, value: Int) {
    view?.editText?.minLines = value
  }

  override fun createShadowNodeInstance(): CustomShadowNode {
    Log.d("RichEdit", "createShadowNodeInstance")
    return CustomShadowNode()
  }

  override fun getShadowNodeClass(): Class<LayoutShadowNode> {
    Log.d("RichEdit", "getShadowNodeClass")
    return CustomShadowNode::class.java as Class<LayoutShadowNode>
  }


  override fun updateProperties(viewToUpdate: RichEditText, props: ReactStylesDiffMap?) {

    // props에서 스타일 관련 값을 추출 (예: backgroundColor, borderWidth, borderColor, borderRadius, padding 등)
    val backgroundColor = if (props?.hasKey("backgroundColor") == true) {
      props.getInt("backgroundColor", Color.TRANSPARENT)
    } else {
      Color.TRANSPARENT // 기본값 또는 원하는 다른 값
    }

    val borderWidth =
      if (props?.hasKey("borderWidth") == true) props.getInt("borderWidth", 0) else 0
    val borderColor =
      if (props?.hasKey("borderColor") == true) props.getInt("borderColor", Color.TRANSPARENT) else Color.TRANSPARENT
    val borderRadius = if (props?.hasKey("borderRadius") == true) {
      props.getInt("borderRadius", 0)
    } else {
      0
    }

    val padding = if (props?.hasKey("padding") == true) props.getInt("padding", 0) else null
    val paddingTop =
      if (props?.hasKey("paddingTop") == true) props.getInt("paddingTop", 0) else null
    val paddingBottom =
      if (props?.hasKey("paddingBottom") == true) props.getInt("paddingBottom", 0) else null
    val paddingLeft =
      if (props?.hasKey("paddingLeft") == true) props.getInt("paddingLeft", 0) else null
    val paddingRight =
      if (props?.hasKey("paddingRight") == true) props.getInt("paddingRight", 0) else null

    val extraStyle = ExtraStyle(
      backgroundColor = backgroundColor,
      borderWidth = borderWidth,
      borderColor = borderColor,
      borderRadius = borderRadius,
      padding = padding,
      paddingTop = paddingTop,
      paddingBottom = paddingBottom,
      paddingLeft = paddingLeft,
      paddingRight = paddingRight
    )
    viewToUpdate.setBackgroundColor(Color.BLUE)
    // 업데이트된 스타일을 native 뷰에 적용
    viewToUpdate.applyExtraStyle(extraStyle)
    Log.d("RichEdit", "요게 되는거 같은디? updateProperties $props")
    super.updateProperties(viewToUpdate, props)
  }

  companion object {
    const val REACT_CLASS = "RichTextEditor"
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "onTextChange" to mapOf("registrationName" to "onTextChange")
    )
  }
}