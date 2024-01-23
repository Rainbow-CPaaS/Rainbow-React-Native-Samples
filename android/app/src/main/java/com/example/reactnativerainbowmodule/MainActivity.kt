package com.example.reactnativerainbowmodule

import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import com.ale.rainbow.rn.notifications.NotificationHandler
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
    private var channelName = "My Channel"
    private var channelImportance = NotificationManager.IMPORTANCE_HIGH

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "RainbowModuleExample"
    }

    override fun invokeDefaultOnBackPressed() {
        moveTaskToBack(true)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        createNotificationChannel()
        NotificationHandler.setChannelId(CHANNEL_ID)
    }

    private fun createNotificationChannel() {
        Log.i("MainActivity", "createNotificationChannel: ")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                channelName,
                channelImportance
            )
            val notificationManager = getSystemService(
                NotificationManager::class.java
            )
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {
        @JvmField
        var CHANNEL_ID = "Your Channel ID"
    }
}
