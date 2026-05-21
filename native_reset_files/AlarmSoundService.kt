/*
	File that runs and plays the sounds on Android
 */

package com.dilank.alarmclockai.alarm

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.dilank.alarmclockai.MainActivity
import com.dilank.alarmclockai.R

class AlarmSoundService : Service() {
  // MediaPlayer loads audio files and plays sounds on Android
  private var mediaPlayer: MediaPlayer? = null
  private val logTag = "AlarmSoundService"

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val action = intent?.action ?: ACTION_START // Take intent, otherwise play ACTION_START

	Log.d(logTag, "Logcheck")

	// Checks to see if it is supposed to stop alarm (Likely removed soon)
    if (action == ACTION_STOP) {
      stopAlarm()
      stopForeground(STOP_FOREGROUND_REMOVE)
      stopSelf()
      return START_NOT_STICKY
    }

	// Creates a "channel" in Android that turns the alarm into a foregroundservice (needed in Android 8.0+)
    createChannelIfNeeded()
    startForeground(NOTIFICATION_ID, buildForegroundNotification())

	val prefs = getSharedPreferences("alarm_preferences", Context.MODE_PRIVATE)
	val alarmUri = prefs.getString("alarm_sound_uri", null)

	if (alarmUri != null) {
		val uri = Uri.parse(alarmUri)
		tryStartPlayer(uri)
	} else {
		Log.e("ALARM_DEBUG", "No alarm URI found")
	}

    return START_STICKY
  }

  // Function that shuts down the alarm
  private fun stopAlarm() {
	  mediaPlayer?.stop()
	  mediaPlayer?.release()
	  mediaPlayer = null
	}

  // Stops alarm when ran (cleanest alarm stop practice)
  override fun onDestroy() {
    stopAlarm()
    super.onDestroy()
  }

  // Binding is another way to play sounds like music, binding is disabled here
  override fun onBind(intent: Intent?): IBinder? = null

//   private fun tryStartPlayer() {
// 	return try {
// 		// Reset mediaplayer
// 		mediaPlayer?.stop()
// 		mediaPlayer?.release()
// 		mediaPlayer = null

// 		val player 
// 	}

//     if (mediaPlayer != null) return

//     val prefs = getSharedPreferences(AlarmSchedulerModule.PREFS_NAME, Context.MODE_PRIVATE)
//     val customUri = prefs.getString(AlarmSchedulerModule.KEY_SOUND_URI, null)

//     val fallbackUri = Uri.parse("android.resource://$packageName/${R.raw.alarm_voice}")
//     val customParsedUri = customUri?.takeIf { it.isNotBlank() }?.let { Uri.parse(it) }

//     if (customParsedUri != null) {
//       Log.d(logTag, "Trying custom alarm URI: $customParsedUri")
//       if (tryStartPlayer(customParsedUri)) return
//       Log.w(logTag, "Custom alarm URI failed, falling back to bundled alarm sound")
//     }

//     if (!tryStartPlayer(fallbackUri)) {
//       Log.e(logTag, "Failed to start alarm playback with both custom and fallback URI")
//       stopForeground(STOP_FOREGROUND_REMOVE)
//       stopSelf()
//     }
//   }

  // Starts MediaPlayer()
  private fun tryStartPlayer(soundUri: Uri): Boolean {
    return try {
	  // MediaPlayer setup: What kind of sound and how should the system handle it
	  /*
	  	USAGE_ALARM: Alarm clock (ex. USAGE_MEDIA, USAGE_NOTIFICATION)
		CONTENT_TYPE_SONIFICATION: Beeps, alarms, UI sounds (ex. CONTENT_TYPE_MUSIC, CONTENT_TYPE_SPEECH)
	   */
		// Reset mediaplayer
		mediaPlayer?.stop()
		mediaPlayer?.release()
		mediaPlayer = null

		val player = MediaPlayer().apply {
			setAudioAttributes(
			AudioAttributes.Builder()
				.setUsage(AudioAttributes.USAGE_ALARM)
				.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
				.build()
			)
			setDataSource(applicationContext, soundUri) // Tells MediaPlayer what audio file to play (soundUri)
			isLooping = true // Looping audio file
			prepare()
			start()
		}
		// Save player to class-level variable defined above
		mediaPlayer = player
		true // returns true
    } catch (exception: Exception) {
      Log.e(logTag, "Unable to start alarm audio for URI: $soundUri", exception)
      mediaPlayer?.release()
      mediaPlayer = null
      false
    }
  }

  // Builds the notification for the alarm, defines what happens when you tap the alarm
  // and adds stop button.
  private fun buildForegroundNotification(): Notification {
    val openIntent = Intent(this, MainActivity::class.java).apply {
      action = Intent.ACTION_VIEW
      data = Uri.parse("alarmclockai://alarm-ring")
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }

    val openPendingIntent = PendingIntent.getActivity(
      this, 8181, openIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val stopIntent = Intent(this, AlarmReceiver::class.java).apply {
      action = AlarmReceiver.ACTION_STOP_ALARM
    }

    val stopPendingIntent = PendingIntent.getBroadcast(
      this, 8182, stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

 	Log.d(logTag, "Building notification with action")

    return NotificationCompat.Builder(this, CHANNEL_ID)
	.setSmallIcon(R.mipmap.ic_launcher)
	.setContentTitle("Wake up")
	.setContentText("Your alarm is ringing")
	.setCategory(NotificationCompat.CATEGORY_ALARM)
	.setPriority(NotificationCompat.PRIORITY_MAX)
	.setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
	// .setOngoing(true)
	.setContentIntent(openPendingIntent)
	// .setFullScreenIntent(openPendingIntent, true)
	// .setStyle(NotificationCompat.MediaStyle().setShowActionsInCompactView(0))
	.addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", stopPendingIntent)
	.build().also { Log.d(logTag, "Notification built successfully") }
  }

  // Creates notificationchannel (Similar to media channel above)
  private fun createChannelIfNeeded() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val channel = NotificationChannel(
      CHANNEL_ID, "Alarm Sound", NotificationManager.IMPORTANCE_HIGH
    ).apply {
      description = "Alarm playback"
      lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      setBypassDnd(true)
      setSound(null, null)
    }

    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.createNotificationChannel(channel)
  }

  companion object {
    const val ACTION_START = "com.dilank.alarmclockai.alarm.START"
    const val ACTION_STOP = "com.dilank.alarmclockai.alarm.STOP"
    private const val CHANNEL_ID = "alarm_sound_service_v1"
    private const val NOTIFICATION_ID = 5050
  }
}