package com.nativespecs

import android.graphics.*
import android.graphics.drawable.Drawable
import android.net.Uri
import android.text.style.ImageSpan

class ResizableImageSpan(
  val sourceDrawble: Drawable,
  private val uri: Uri,
  var width: Int,
  var height: Int
) : ImageSpan(
  sourceDrawble,
  uri.toString(),
  ALIGN_BASELINE
) {

  override fun getSize(
    paint: Paint,
    text: CharSequence,
    start: Int,
    end: Int,
    fm: Paint.FontMetricsInt?
  ): Int {
    val rect = sourceDrawble.bounds
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
    sourceDrawble.setBounds(x.toInt(), top, x.toInt() + width, top + height)
    sourceDrawble.draw(canvas)
  }

  // 그릴 때마다 크기를 재설정
  override fun getDrawable(): Drawable {
    return super.getDrawable().apply {
      setBounds(0, 0, width, height)
    }
  }

  override fun getSource(): String {
    return "${uri.toString()}\" width=\"$width\" height=\"$height"
  }

  fun resize(newWidth: Int, newHeight: Int) {
    this.width = newWidth
    this.height = newHeight
    sourceDrawble.setBounds(0, 0, newWidth, newHeight)
    sourceDrawble.invalidateSelf()

  }
}
