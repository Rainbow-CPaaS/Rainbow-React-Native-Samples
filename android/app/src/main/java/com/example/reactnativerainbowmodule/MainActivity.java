package com.example.reactnativerainbowmodule;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.ale.rainbow.rn.notifications.NotificationHandler;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  static String CHANNEL_ID = "Your Channel ID";
  String CHANNEL_NAME = "My Channel";
  int CHANNEL_IMPORTANCE = NotificationManager.IMPORTANCE_HIGH;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RainbowModuleExample";
  }
  @Override
    public void invokeDefaultOnBackPressed(){
      this.moveTaskToBack(true);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    createNotificationChannel();
    NotificationHandler notificationHandler = new NotificationHandler(this);
    notificationHandler.setChannelId(CHANNEL_ID);

  }
  private void createNotificationChannel() {
    Log.i("MainActivity", "createNotificationChannel: ");
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(
              CHANNEL_ID,
              CHANNEL_NAME,
              CHANNEL_IMPORTANCE
      );
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }
  }
}
