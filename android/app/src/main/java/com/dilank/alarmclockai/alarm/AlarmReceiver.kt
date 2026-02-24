package com.dilank.alarmclockai.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val serviceIntent = Intent(context, AlarmSoundService::class.java).apply {
      action = AlarmSoundService.ACTION_START
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      context.startForegroundService(serviceIntent)
    } else {
      context.startService(serviceIntent)
    }

    AlarmSchedulerModule.clearStoredAlarm(context)
  }
}




// package com.dilank.alarmclockai.alarm

// import android.app.NotificationChannel
// import android.app.NotificationManager
// import android.app.PendingIntent
// import android.content.BroadcastReceiver
// import android.content.Context
// import android.content.Intent
// import android.net.Uri
// import android.os.Build
// import androidx.core.app.NotificationCompat
// import androidx.core.app.NotificationManagerCompat
// import com.dilank.alarmclockai.MainActivity
// import com.dilank.alarmclockai.R

// class AlarmReceiver : BroadcastReceiver() {
//   override fun onReceive(context: Context, intent: Intent?) {
//     val soundUri = Uri.parse("android.resource://${context.packageName}/${R.raw.alarm_voice}")
//     createAlarmChannelIfNeeded(context, soundUri)

//     val openAppIntent = Intent(context, MainActivity::class.java).apply {
//       action = Intent.ACTION_VIEW
//       data = Uri.parse("alarmclockai://alarm-ring")
//       flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
//     }

//     val openAppPendingIntent = PendingIntent.getActivity(
//       context,
//       8181,
//       openAppIntent,
//       PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
//     )

//     val notification = NotificationCompat.Builder(context, CHANNEL_ID)
//       .setSmallIcon(R.mipmap.ic_launcher)
//       .setContentTitle("Wake up")
//       .setContentText("Your alarm is ringing")
//       .setCategory(NotificationCompat.CATEGORY_ALARM)
//       .setPriority(NotificationCompat.PRIORITY_MAX)
//       .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
//     //   .setSound(soundUri)
//       .setAutoCancel(true)
//       .setOngoing(true)
//       .setContentIntent(openAppPendingIntent)
//       .setFullScreenIntent(openAppPendingIntent, true)
//       .build()

//     NotificationManagerCompat.from(context).notify(ALARM_NOTIFICATION_ID, notification)
//     AlarmSchedulerModule.clearStoredAlarm(context)
//   }

//   private fun createAlarmChannelIfNeeded(context: Context, soundUri: Uri) {
//     if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

//     val channel = NotificationChannel(
//       CHANNEL_ID,
//       "Alarm",
//       NotificationManager.IMPORTANCE_HIGH
//     ).apply {
//       lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
//       setBypassDnd(true)
//       description = "Alarm notifications"
//       setSound(soundUri, null)
//     }

//     val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
//     manager.createNotificationChannel(channel)
//   }

//   companion object {
//     private const val CHANNEL_ID = "native_alarm_channel_v4"
//     private const val ALARM_NOTIFICATION_ID = 4040
//   }
// }