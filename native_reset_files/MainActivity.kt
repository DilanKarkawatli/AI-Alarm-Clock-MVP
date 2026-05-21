/*
	MainActivity.kt is the entrypoint of the android app.
	It wires together the main app, an expo wrapper for the app and 
	functionality of the back button in the app.
 */

package com.dilank.alarmclockai
import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
	/*
		MainActivity: Uses a pre-built core class 'ReactActivity' from React Native (see import)
					  that bridges the gap between the Android Native code and the React Native app.
	 */
  override fun onCreate(savedInstanceState: Bundle?) {
    // Setup for expo-splash-screen.
    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-f3ff59a738c56c9a6119210cb55f0b613eb8b6af
    SplashScreenManager.registerOnActivity(this)
    // @generated end expo-splashscreen
    super.onCreate(null)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /*
	Returns the instance of the 'ReactActivityDelegate' that is an import from 
	the expo library (see imports). We use 'DefaultReactActivityDelegate' 
	which allows you to enable New Architecture with a single boolean flags 'fabricEnabled'.

	Function basically creates & returns an instance of 'ReactActivityDelegateWrapper'
	which basically uses the normal React Native setup with the expo wrapper.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than 'Activity.moveTaskToBack' in fact.
      super.invokeDefaultOnBackPressed()
  }
}
