package com.dilank.alarmclockai.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.dilank.alarmclockai.MainActivity
import java.util.Calendar

class AlarmReceiver : BroadcastReceiver() {
	private val logTag = "AlarmReceiver"

    override fun onReceive(context: Context, intent: Intent?) {
		if (context == null) return

        Log.d("ALARM_DEBUG", "AlarmReceiver triggered")

        // Start alarm sound service
        val serviceIntent = Intent(context, AlarmSoundService::class.java)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }

        // Launch the app UI
        val alarmIntent = Intent(context, MainActivity::class.java).apply {
            flags =
                Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("alarm_triggered", true)
        }

        context.startActivity(alarmIntent)

		// Check if this alarm repeats daily
		val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
		val repeatDaily = prefs.getBoolean(KEY_REPEAT_DAILY, false)

		if (repeatDaily) {
		rescheduleAlarmForNextDay(context, prefs)
		}
    }

	private fun rescheduleAlarmForNextDay(
		context: Context,
		prefs: android.content.SharedPreferences
	) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
		val alarmTime = prefs.getLong(KEY_ALARM_TIME_MILLIS, 0)

		if (alarmTime == 0L) {
			Log.w(logTag, "No alarm time stored, cannot reschedule")
			return
		}

		// Calculate next day's alarm time
		val calendar = Calendar.getInstance().apply {
			timeInMillis = alarmTime
			add(Calendar.DAY_OF_MONTH, 1)
		}

		val pendingIntent = getPendingIntent(context)
		
		try {
			alarmManager.setExactAndAllowWhileIdle(
				AlarmManager.RTC_WAKEUP,
				calendar.timeInMillis,
				pendingIntent
			)
			Log.d(logTag, "Rescheduled alarm for next day: ${calendar.time}")
		} catch (e: SecurityException) {
			Log.e(logTag, "Failed to reschedule alarm", e)
		}
	}

	private fun getPendingIntent(context: Context): PendingIntent {
		val intent = Intent(context, AlarmReceiver::class.java)
		return PendingIntent.getBroadcast(
			context,
			ALARM_REQUEST_CODE,
			intent,
			PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
		)
	}

	companion object {
		const val PREFS_NAME = "alarm_preferences"
		const val KEY_REPEAT_DAILY = "repeat_daily"
		const val KEY_ALARM_TIME_MILLIS = "alarm_time_millis"
		const val ALARM_REQUEST_CODE = 12345
	}
}