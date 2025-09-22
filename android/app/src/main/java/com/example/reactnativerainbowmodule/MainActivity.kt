package com.example.reactnativerainbowmodule

import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import com.ale.rainbow.rn.notifications.NotificationHandler
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled



class MainActivity : ReactActivity() {
    private var channelName = "My Channel"
    private var channelImportance = NotificationManager.IMPORTANCE_HIGH

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "RainbowModuleExample"



    override fun invokeDefaultOnBackPressed() {
        moveTaskToBack(true)
    }
    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        createNotificationChannel()
         NotificationHandler(this)
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
