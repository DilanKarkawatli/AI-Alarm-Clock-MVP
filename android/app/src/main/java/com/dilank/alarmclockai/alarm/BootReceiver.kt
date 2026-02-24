package com.dilank.alarmclockai.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val action = intent?.action ?: return

    val shouldRestore =
      action == Intent.ACTION_BOOT_COMPLETED ||
      action == Intent.ACTION_LOCKED_BOOT_COMPLETED ||
      action == Intent.ACTION_MY_PACKAGE_REPLACED

    if (!shouldRestore) return

    val prefs = context.getSharedPreferences(AlarmSchedulerModule.PREFS_NAME, Context.MODE_PRIVATE)
    val triggerAtMillis = prefs.getLong(AlarmSchedulerModule.KEY_TRIGGER_AT_MILLIS, -1L)
    val requestCode = prefs.getInt(
      AlarmSchedulerModule.KEY_REQUEST_CODE,
      AlarmSchedulerModule.DEFAULT_REQUEST_CODE
    )

    if (triggerAtMillis <= System.currentTimeMillis()) {
      AlarmSchedulerModule.clearStoredAlarm(context)
      return
    }

    AlarmSchedulerModule.scheduleAlarmInternal(context, triggerAtMillis, requestCode)
  }
}