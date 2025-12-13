package com.getevapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.kakao.sdk.common.KakaoSdk
import com.nativespecs.NativeKakaoLoginPackage
import com.nativespecs.RichEditTextPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(NativeKakaoLoginPackage())
          add(RichEditTextPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    KakaoSdk.init(this, "bb3f61d20a648f814f967c69df9f3b84")
  }
}
