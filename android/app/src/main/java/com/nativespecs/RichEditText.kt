package com.nativespecs

import android.content.Context
import android.graphics.Color
import android.graphics.Rect
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.text.*
import android.text.method.ScrollingMovementMethod
import android.text.style.ForegroundColorSpan
import android.text.style.StrikethroughSpan
import android.text.style.StyleSpan
import android.text.style.UnderlineSpan
import android.util.AttributeSet
import android.util.Log
import android.view.ActionMode
import android.view.Gravity
import android.view.Menu
import android.view.MenuItem
import android.view.MotionEvent
import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.*
import android.widget.LinearLayout.HORIZONTAL
import androidx.activity.result.ActivityResultLauncher
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.uimanager.events.RCTModernEventEmitter
import com.getevapp.R

class RichEditText(context: Context, attrs: AttributeSet?) : LinearLayout(context, attrs) {

  val editText: EditText
  private val htmlPreview: TextView
  private val styleToolbar: LinearLayout
  private val stylePopup: PopupWindow

  // 툴바 팝업 관련 변수
  private var hasEditTextFocus: Boolean = false

  // 이미지 리사이징 관련 변수
  private var resizingSpan: ResizableImageSpan? = null
  private var initialTouchX = 0f
  private var initialTouchY = 0f
  private var initialWidth = 0
  private var initialHeight = 0
  var imageLauncher: ActivityResultLauncher<String>? = null

  private var gradientDrawable: GradientDrawable = GradientDrawable()

  init {
    orientation = VERTICAL
    gravity = Gravity.START
    styleToolbar = createStyleToolbar()
    editText = createEditText()
    htmlPreview = createHtmlPreview()

    layoutParams = LayoutParams(MATCH_PARENT, 300)


    background = gradientDrawable
    val saveBtn = createButton("저장하기") { saveHtml() }
    val loadBtn = createButton("불러오기") { loadHtmlSample() }

    stylePopup = PopupWindow(
      styleToolbar,
      LayoutParams.MATCH_PARENT,
      LayoutParams.WRAP_CONTENT,
      true
    ).apply {
      elevation = 16f
      isOutsideTouchable = false
      isFocusable = false
    }

    addView(editText)
//    addView(saveBtn)
//    addView(loadBtn)
//    addView(htmlPreview)
    observeKeyboardHeight()
  }

  fun applyExtraStyle(style: ExtraStyle) {
    this.setBackgroundColor(style.backgroundColor)
    this.setPadding(
      style.resolvedPaddingLeft,
      style.resolvedPaddingTop,
      style.resolvedPaddingRight,
      style.resolvedPaddingBottom
    )

    val density = resources.displayMetrics.density

    // GradientDrawable을 새로 생성해서 배경 및 테두리 스타일 적용
    gradientDrawable.apply {
      // 배경색 적용
      setColor(style.backgroundColor)
      // borderWidth와 borderColor가 모두 있을 때 테두리 적용
      setStroke(style.borderWidth * density.toInt(), style.borderColor)
      // borderRadius가 있을 경우 둥근 모서리 적용
      style.borderRadius.let { radius ->
        cornerRadius = radius * density
      }

    }

    refreshBackGround()
  }

  private fun refreshBackGround() {
    background = gradientDrawable
  }
  // ----------------------------
  // Component creation helpers
  // ----------------------------

  private fun createEditText(): EditText {
    return EditText(context).apply {
      layoutParams = ViewGroup.LayoutParams(
        MATCH_PARENT,
        WRAP_CONTENT
      )
      gravity = Gravity.CENTER_VERTICAL

      hint = "내용을 입력하세요"
      inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
      isVerticalScrollBarEnabled = true
      overScrollMode = OVER_SCROLL_ALWAYS
      scrollBarStyle = SCROLLBARS_INSIDE_INSET
      movementMethod = ScrollingMovementMethod.getInstance()
      setLines(10)
      maxLines = 10
      minLines = 1
      minHeight = 100
      // 선택 모드 되도록
      isFocusable = true
      isFocusableInTouchMode = true
      isClickable = true
      isLongClickable = true
      setTextIsSelectable(true)

      setSingleLine(false)
      // 이게 없으면 키보드 올라오면 스크롤이 제대로 안 될 수도 있음
      setHorizontallyScrolling(false)

      setOnFocusChangeListener { _, hasFocus ->
        if (hasFocus) {
          hasEditTextFocus = true
          styleToolbar.visibility = VISIBLE
          Log.d("RichEdit", "Focus")
        } else {
          hasEditTextFocus = false
          styleToolbar.visibility = GONE
          Log.d("RichEdit", "NotFocus")
        }

      }

      setOnTouchListener { _, event ->
        val x = event.x
        val y = event.y

        val offset = editText.getOffsetForPosition(x, y)
        val spannable = editText.text
        val spans = spannable.getSpans(offset, offset, ResizableImageSpan::class.java)
        if (spans.isNotEmpty()) {
          when (event.action) {
            MotionEvent.ACTION_DOWN -> {
              if (spans.isNotEmpty()) {
                resizingSpan = spans[0]
                initialTouchX = x
                initialTouchY = y
                initialWidth = resizingSpan!!.width
                initialHeight = resizingSpan!!.height
                return@setOnTouchListener true // 이미지 터치 시 이벤트 소비
              } else {
                // 이미지가 아니면 포커스 요청
                editText.requestFocus()
                return@setOnTouchListener false // 기본 동작 허용
              }
            }

            MotionEvent.ACTION_MOVE -> {
              resizingSpan?.let { span ->
                val deltaX = (x - initialTouchX).toInt()
                val deltaY = (y - initialTouchY).toInt()

                // 최소 크기 제한
                val newWidth = maxOf(50, initialWidth + deltaX)
                val newHeight = maxOf(50, initialHeight + deltaY)

                span.resize(newWidth, newHeight)

                // 기존 텍스트와 커서 위치 저장
                val currentText = editText.text
                val selectionStart = editText.selectionStart
                val selectionEnd = editText.selectionEnd

                // 강제 텍스트 재할당
                editText.setText(currentText)
                editText.setSelection(selectionStart, selectionEnd)

                editText.invalidate()
                editText.requestLayout()
                return@setOnTouchListener true
              }
              return@setOnTouchListener false
            }

            MotionEvent.ACTION_UP -> {
              // 드래그가 아니라 클릭으로 간주할 정도로 이동이 적었으면 performClick 호출
              if (resizingSpan == null &&
                Math.abs(x - initialTouchX) < 10 && Math.abs(y - initialTouchY) < 10
              ) {
                editText.performClick()
              }
              // 이미지 터치였다면 여기서 이벤트 소비, 그렇지 않으면 false
              if (resizingSpan != null) {
                resizingSpan = null
                return@setOnTouchListener true
              } else {
                return@setOnTouchListener false
              }
            }
          }
          return@setOnTouchListener true
        }

        false
      }

      addTextChangedListener(object : TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
          s?.let { dispatchTextChangeEvent(it.toString()) }
        }
        override fun afterTextChanged(s: Editable?) {
          updateHtmlPreview()
        }
      })

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        customInsertionActionModeCallback = object : ActionMode.Callback {
          override fun onCreateActionMode(mode: ActionMode?, menu: Menu?): Boolean = false
          override fun onPrepareActionMode(mode: ActionMode?, menu: Menu?): Boolean = false
          override fun onActionItemClicked(mode: ActionMode?, item: MenuItem?): Boolean = false
          override fun onDestroyActionMode(mode: ActionMode?) {}
        }
      }
    }
  }

  private fun dispatchTextChangeEvent(text: String) {
    val html = Html.toHtml(editText.text, Html.TO_HTML_PARAGRAPH_LINES_INDIVIDUAL)

    val reactContext = context as ReactContext
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
    dispatcher?.dispatchEvent(TextChangeEvent(surfaceId, id, html))
  }

  private fun createStyleToolbar(): LinearLayout {
    return LinearLayout(context).apply {
      orientation = HORIZONTAL
      gravity = Gravity.START
      setBackgroundColor(Color.BLUE)
      setPadding(20, 20, 20, 20)

      addView(createIconButton(R.drawable.ic_bold) {
        toggleSpan(StyleSpan::class.java) { StyleSpan(Typeface.BOLD) }
      })

      addView(createIconButton(R.drawable.ic_italic) {
        toggleSpan(StyleSpan::class.java) { StyleSpan(Typeface.ITALIC) }
      })

      addView(createIconButton(R.drawable.ic_strikethrough) {
        toggleSpan(StrikethroughSpan::class.java) { StrikethroughSpan() }
      })

      addView(createIconButton(R.drawable.ic_underline) {
        toggleSpan(UnderlineSpan::class.java) { UnderlineSpan() }
      })

      addView(createIconButton(R.drawable.ic_image) {
        try {
          if (imageLauncher == null) {
            Log.e("RichEdit", "이미지 런처가 없습니다.")
          } else {
            imageLauncher?.launch("image/*")
          }
        } catch (e: Exception) {
          Log.e("RichEditText", "❌ insertImage failed: ${e.message}")
        }
      })

      addView(createIconButton(R.drawable.ic_color) {
        toggleSpan(ForegroundColorSpan::class.java) { ForegroundColorSpan(Color.RED) }
      })
    }
  }

  private fun createHtmlPreview(): TextView {
    return TextView(context).apply {
      textSize = 14f
      setTextColor(Color.DKGRAY)
      setPadding(0, 32, 0, 0)
    }
  }

  private fun createButton(text: String, onClick: () -> Unit): Button {
    return Button(context).apply {
      this.text = text
      setOnClickListener { onClick() }
    }
  }

  // ----------------------------
  // Span toggling
  // ----------------------------

  private fun toggleSpan(spanType: Class<*>, createSpan: () -> Any) {
    val start = editText.selectionStart
    val end = editText.selectionEnd
    if (start >= end) return

    val spannable = editText.text as Spannable
    val spans = spannable.getSpans(start, end, spanType)

    var removed = false
    for (span in spans) {
      if (spannable.getSpanStart(span) <= start && spannable.getSpanEnd(span) >= end) {
        spannable.removeSpan(span)
        removed = true
      }
    }

    if (!removed) {
      spannable.setSpan(createSpan(), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }

    updateHtmlPreview()
  }

  private fun updateHtmlPreview() {
    val html = Html.toHtml(editText.text, Html.TO_HTML_PARAGRAPH_LINES_INDIVIDUAL)
    htmlPreview.text = html
  }

  // ----------------------------
  // Save / Load HTML
  // ----------------------------

  private fun saveHtml() {
    val html = Html.toHtml(editText.text, Html.TO_HTML_PARAGRAPH_LINES_INDIVIDUAL)
    Toast.makeText(context, "HTML 저장됨:\n$html", Toast.LENGTH_SHORT).show()
    htmlPreview.text = html
  }

  private fun loadHtmlSample() {
    val html = "<b>굵은 텍스트</b> <i>기울임</i> <font color='red'>빨간색</font>"
    val spanned = Html.fromHtml(html, Html.FROM_HTML_MODE_LEGACY)
    editText.setText(spanned)
  }

  // ----------------------------
  // Keyboard / Popup
  // ----------------------------

  private fun observeKeyboardHeight() {
    val decorView = (context as? ThemedReactContext)?.currentActivity?.window?.decorView ?: return
    decorView.viewTreeObserver.addOnGlobalLayoutListener {
      val rect = Rect()
      decorView.getWindowVisibleDisplayFrame(rect)
      val screenHeight = decorView.rootView.height
      val keypadHeight = screenHeight - rect.bottom

      if (keypadHeight > screenHeight * 0.15) {
        // Keyboard opened
        Log.d("RichEdit", "keyboard Open")
        if (hasEditTextFocus) {
          showPopupIfNeeded(keypadHeight)
          Log.d("RichEdit", "keypadHeight $keypadHeight")
          styleToolbar.visibility = VISIBLE
        }
      } else {
        Log.d("RichEdit", "keyboard Closed")
        styleToolbar.visibility = GONE
      }
    }
  }

  private fun showPopupIfNeeded(keyBoardHeight: Int) {
    val activity = (context as? ThemedReactContext)?.currentActivity
    val decorView = activity?.window?.decorView

    if (activity == null || decorView == null) {
      Log.e("RichEditText", "❌ Activity or decorView is null")
      return
    }

    if (!stylePopup.isShowing) {
      decorView.post {
        try {
          stylePopup.showAtLocation(decorView, Gravity.BOTTOM, 0, keyBoardHeight)
        } catch (e: Exception) {
          Log.e("RichEditText", "❌ Popup failed: ${e.message}")
        }
      }
    }
  }

  private fun createIconButton(iconResId: Int, onClick: () -> Unit): ImageButton {
    return ImageButton(context).apply {
      setImageResource(iconResId)
      setBackgroundColor(Color.TRANSPARENT) // 배경 없애기
      setPadding(16, 16, 16, 16)
      setOnClickListener { onClick() }
      layoutParams = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      ).apply {
        marginEnd = 16
      }
    }
  }

//  private fun insertImage(drawableResId: Int) {
//    val drawable = context.getDrawable(drawableResId) ?: return
//    drawable.setBounds(0, 0, 100, 100) // 크기 100x100
//
//    val imageSpan = ResizableImageSpan(drawable, uri,200, 200)
//
//    val spannable = editText.text
//    val cursorPosition = editText.selectionStart
//
//    // 텍스트가 비어있거나 커서가 텍스트 뒤에 있으면 안전하게 처리
//    if (cursorPosition < 0 || cursorPosition > spannable.length) return
//
//    spannable.insert(cursorPosition, "\uFFFC")
//    spannable.setSpan(
//      imageSpan,
//      cursorPosition,
//      cursorPosition + 1,
//      Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
//    )
//
//    updateHtmlPreview() // 미리보기 업데이트
//  }


  fun insertImageFromUri(uri: Uri) {
    val inputStream = context.contentResolver.openInputStream(uri)
    val drawable = Drawable.createFromStream(inputStream, uri.toString()) ?: return
    drawable.setBounds(0, 0, 100, 100)

    val imageSpan = ResizableImageSpan(drawable, uri, 100, 100)
    val spannable = editText.text
    val cursorPosition = editText.selectionStart

    // 텍스트가 비어있거나 커서가 텍스트 뒤에 있으면 안전하게 처리
    if (cursorPosition < 0 || cursorPosition > spannable.length) return

    spannable.insert(cursorPosition, "\uFFFC")
    spannable.setSpan(
      imageSpan,
      cursorPosition,
      cursorPosition + 1,
      Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
    )

    updateHtmlPreview()
  }

  private fun getWordBoundaries(text: CharSequence, offset: Int): Pair<Int, Int> {
    var start = offset
    var end = offset

    while (start > 0 && !Character.isWhitespace(text[start - 1])) {
      start--
    }
    while (end < text.length && !Character.isWhitespace(text[end])) {
      end++
    }

    return Pair(start, end)
  }
}
