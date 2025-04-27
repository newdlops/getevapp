package com.nativespecs

import android.graphics.Color

data class ExtraStyle(
  val backgroundColor: Int = Color.TRANSPARENT,
  val padding: Int? = null,         // 전체 padding 값
  val paddingTop: Int? = null,
  val paddingBottom: Int? = null,
  val paddingLeft: Int? = null,
  val paddingRight: Int? = null,
  val borderColor: Int = Color.RED,
  val borderWidth: Int = 0,
  val borderRadius: Int = 0,
) {
  // 각 방향의 padding은 개별 값이 있으면 사용하고, 없으면 전체 padding(padding) 값을 사용
  val resolvedPaddingTop: Int get() = paddingTop ?: padding ?: 0
  val resolvedPaddingBottom: Int get() = paddingBottom ?: padding ?: 0
  val resolvedPaddingLeft: Int get() = paddingLeft ?: padding ?: 0
  val resolvedPaddingRight: Int get() = paddingRight ?: padding ?: 0
}
