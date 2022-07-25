package com.example.reactnativerainbowmodule;

import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;


import com.ale.rainbow.rn.notifications.INotificationHandler;
import com.ale.rainbow.rn.notifications.NotificationHandler;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseService  extends FirebaseMessagingService{
    private INotificationHandler notificationHandler;

    @Override
    public void onCreate() {
        super.onCreate();
        Intent notificationIntent =  new Intent(this, MainActivity.class);
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent intent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
        notificationHandler = new NotificationHandler(this,intent);
    }

    @Override
    public void onNewToken(@NonNull String refreshedToken) {
        super.onNewToken(refreshedToken);
        Log.i("MyFirebaseService", "onNewToken: "+refreshedToken);
        notificationHandler.onTokenRefresh(refreshedToken);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        Log.i("MyFirebaseService", "onMessageReceived: "+remoteMessage);
        notificationHandler.onPushMessageReceived(remoteMessage,this.getApplication());
        super.onMessageReceived(remoteMessage);
    }
}
