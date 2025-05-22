package com.example.reactnativerainbowmodule
import android.util.Log
import com.ale.rainbow.rn.notifications.NotificationHandler
import com.ale.rainbow.rn.notifications.NotificationHandler.Companion.setChannelId
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseService : FirebaseMessagingService() {
    private var notificationHandler: NotificationHandler? = null

    override fun onCreate() {
        super.onCreate()
        notificationHandler = NotificationHandler(this)
        setChannelId(MainActivity.CHANNEL_ID)
    }

    override fun onNewToken(refreshedToken: String) {
        super.onNewToken(refreshedToken)
        Log.i(TAG, "onNewToken: $refreshedToken")
        notificationHandler!!.onTokenRefresh(refreshedToken)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.i(TAG, "onMessageReceived: $remoteMessage")
        notificationHandler!!.onPushMessageReceived(
            remoteMessage,
            this.application,
            MainActivity::class.java
        )
        super.onMessageReceived(remoteMessage)
    }
    companion object {
        private val TAG: String = MyFirebaseService::class.java.simpleName
    }
}
