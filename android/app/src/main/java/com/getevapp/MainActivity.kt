package com.getevapp
import android.net.Uri
import android.os.Bundle;
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.nativespecs.RichEditTextPackage

class MainActivity : ReactActivity() {

  private lateinit var getImageLauncher: ActivityResultLauncher<String>


  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)

    getImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
      uri?.let {
        RichEditTextPackage.RichEditTextManagerProvider.manager?.richEditText?.insertImageFromUri(uri)
      }
    }

    if(RichEditTextPackage.RichEditTextManagerProvider.manager == null) {
      Log.e("RichEdit", "manager is null")
    }
//    RichEditTextPackage.RichEditTextManagerProvider.manager?.setImageLauncher(getImageLauncher)
    RichEditTextPackage.RichEditTextManagerProvider.imageLauncher = getImageLauncher
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "getevapp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
