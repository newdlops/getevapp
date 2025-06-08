package com.nativespecs

import android.text.SpanWatcher
import android.text.Spannable

class CustomSpanWatcher(
  private val onStyleChange: (text: Spannable) -> Unit
) : SpanWatcher {
  override fun onSpanAdded(text: Spannable, what: Any, start: Int, end: Int) {
    onStyleChange(text)
  }
  override fun onSpanChanged(
    text: Spannable, what: Any,
    ostart: Int, oend: Int, nstart: Int, nend: Int
  ) {
    onStyleChange(text)
  }
  override fun onSpanRemoved(text: Spannable, what: Any, start: Int, end: Int) {
    onStyleChange(text)
  }
}
