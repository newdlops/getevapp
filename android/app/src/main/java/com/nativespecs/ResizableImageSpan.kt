package com.nativespecs

import android.graphics.*
import android.text.*
import android.text.style.ReplacementSpan
import android.graphics.drawable.Drawable

class ResizableImageSpan(
  val drawable: Drawable,
  var width: Int,
  var height: Int
) : ReplacementSpan() {

  override fun getSize(
    paint: Paint,
    text: CharSequence,
    start: Int,
    end: Int,
    fm: Paint.FontMetricsInt?
  ): Int {
    val rect = drawable.bounds
    if (fm != null) {
      val fontHeight = fm.descent - fm.ascent
      val drHeight = rect.bottom - rect.top

      val centerY = fm.ascent + fontHeight / 2
      fm.ascent = centerY - drHeight / 2
      fm.descent = fm.ascent + drHeight
      fm.top = fm.ascent
      fm.bottom = fm.descent
    }
//    return rect.right
    return width
  }

  override fun draw(
    canvas: Canvas,
    text: CharSequence,
    start: Int,
    end: Int,
    x: Float,
    top: Int,
    y: Int,
    bottom: Int,
    paint: Paint
  ) {
    drawable.setBounds(x.toInt(), top, x.toInt() + width, top + height)
    drawable.draw(canvas)
  }

  fun resize(newWidth: Int, newHeight: Int) {
    this.width = newWidth
    this.height = newHeight
    drawable.setBounds(0, 0, newWidth, newHeight)
    drawable.invalidateSelf()

  }
}
