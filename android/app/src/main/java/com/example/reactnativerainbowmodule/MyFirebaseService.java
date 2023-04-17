package com.example.reactnativerainbowmodule;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;


import com.ale.rainbow.rn.notifications.NotificationHandler;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseService  extends FirebaseMessagingService{
    private NotificationHandler notificationHandler;

    @Override
    public void onCreate() {
        super.onCreate();
        notificationHandler = new NotificationHandler(this);
        notificationHandler.setChannelId(MainActivity.CHANNEL_ID);
    }
    @Override
    public void onNewToken(@NonNull String refreshedToken) {
        super.onNewToken(refreshedToken);
        Log.i("MyFirebaseService", "onNewToken: "+refreshedToken);
        notificationHandler.onTokenRefresh(refreshedToken);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        Log.i("MyFirebaseService", "onMessageReceived: "+remoteMessage);
        notificationHandler.onPushMessageReceived(remoteMessage,this.getApplication(),MainActivity.class);
        super.onMessageReceived(remoteMessage);
    }
}
