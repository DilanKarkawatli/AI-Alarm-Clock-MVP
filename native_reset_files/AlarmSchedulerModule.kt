package com.dilank.alarmclockai

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.dilank.alarmclockai.alarm.AlarmReceiver

class AlarmSchedulerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val logTag = "AlarmSchedulerModule"

  @ReactMethod
  fun scheduleAlarm(timeInMillis: Double, repeatDaily: Boolean = false) {
    val context = reactApplicationContext
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    // Save preferences
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().apply {
      putLong(AlarmReceiver.KEY_ALARM_TIME_MILLIS, timeInMillis.toLong())
      putBoolean(AlarmReceiver.KEY_REPEAT_DAILY, repeatDaily)
      apply()
    }

    val intent = Intent(context, AlarmReceiver::class.java)
    val pendingIntent = PendingIntent.getBroadcast(
      context,
      AlarmReceiver.ALARM_REQUEST_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    try {
      alarmManager.setExactAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP,
        timeInMillis.toLong(),
        pendingIntent
      )
      Log.d(logTag, "Alarm scheduled for: $timeInMillis, repeatDaily: $repeatDaily")
    } catch (e: SecurityException) {
      Log.e(logTag, "Failed to schedule alarm", e)
    }
  }

  @ReactMethod
  fun cancelAlarm() {
    val context = reactApplicationContext
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, AlarmReceiver::class.java)
    val pendingIntent = PendingIntent.getBroadcast(
      context,
      AlarmReceiver.ALARM_REQUEST_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    alarmManager.cancel(pendingIntent)
    
    // Clear preferences
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().apply {
      remove(AlarmReceiver.KEY_REPEAT_DAILY)
      remove(AlarmReceiver.KEY_ALARM_TIME_MILLIS)
      apply()
    }
    
    Log.d(logTag, "Alarm cancelled and preferences cleared")
  }

  @ReactMethod
  fun setAlarmSoundUri(uri: String) {
    val prefs = reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(KEY_SOUND_URI, uri).apply()
    Log.d(logTag, "Alarm sound URI set: $uri")
  }

  override fun getName(): String = "AlarmScheduler"

  companion object {
    const val PREFS_NAME = "alarm_preferences"
    const val KEY_SOUND_URI = "alarm_sound_uri"
  }
}
