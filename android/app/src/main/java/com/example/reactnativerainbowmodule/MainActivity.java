package com.example.reactnativerainbowmodule;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

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
}
