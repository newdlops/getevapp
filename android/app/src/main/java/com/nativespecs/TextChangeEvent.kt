package com.nativespecs

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class TextChangeEvent(surfaceId: Int, viewId: Int, private val text:String): Event<TextChangeEvent>(viewId) {
  override fun getEventName() = EVENT_NAME

  override fun getEventData(): WritableMap? {
    return Arguments.createMap().apply {
      putString("text", text)
    }
  }

  companion object {
    const val EVENT_NAME = "onTextChange"
  }
}