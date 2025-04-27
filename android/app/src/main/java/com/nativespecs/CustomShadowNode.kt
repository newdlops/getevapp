package com.nativespecs

import android.util.Log
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.yoga.YogaMeasureFunction
import com.facebook.yoga.YogaMeasureMode
import com.facebook.yoga.YogaMeasureOutput
import com.facebook.yoga.YogaNode

class CustomShadowNode: LayoutShadowNode(), YogaMeasureFunction {
  private var extraStyles: ExtraStyle = ExtraStyle()

  init {
    setMeasureFunction(this)
    Log.d("RichEdit", "init called")
  }

  fun setExtraStyles(extraStyles: ExtraStyle) {
    this.extraStyles = extraStyles
    Log.d("RichEdit", "setExtraStyle called with: $extraStyles")
    markUpdated()
  }

  fun getExtraStyles(): ExtraStyle = extraStyles

  override fun measure(
    p0: YogaNode?,
    p1: Float,
    p2: YogaMeasureMode?,
    p3: Float,
    p4: YogaMeasureMode?
  ): Long {
    val defaultWidth = 300
    val defaultHeight = 300
    Log.d("RichEdit", "measure called with: $p1, $p3")
    return YogaMeasureOutput.make(defaultWidth, defaultHeight)
  }

  override fun isVirtual(): Boolean = true

  override fun isVirtualAnchor(): Boolean = true
}