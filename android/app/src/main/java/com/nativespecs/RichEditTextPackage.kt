package com.nativespecs

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class RichEditTextPackage: BaseReactPackage() {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>> {
    return listOf(RichEditTextManager(reactContext))
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    when(name){
      RichEditTextManager.REACT_CLASS -> RichEditTextManager(reactContext)
    }
    return null
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    mapOf(RichEditTextManager.REACT_CLASS to ReactModuleInfo(
      RichEditTextManager.REACT_CLASS,
      RichEditTextManager.REACT_CLASS,
      false,
      false,
      false,
      true,
    )
    )
  }
}