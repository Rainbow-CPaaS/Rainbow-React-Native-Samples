//
//  AppDelegate.swift
//  RainbowModuleExample
//
//  Created by Maali Hasan on 16/09/2025.
//


import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    
    // The startReactNative method sets up the rootView for you.
    factory.startReactNative(
      withModuleName: "RainbowModuleExample",
      in: window,
      launchOptions: launchOptions
    )
    
    //register notification
    ServicesManager.sharedInstance().notificationsManager.registerForUserNotificationsSettings { granted, error in
        if let error = error {
            NSLog("registerForUserNotificationsSettingsWithCompletionHandler returned an error: %@", error.localizedDescription)
        } else if granted {
            NSLog("Push notifications granted")
        } else {
            NSLog("Push notifications not granted")
        }
    }
    RNRainbowRn.sharedManager().initRainbowServiceManager()
    if let defaultConfig = RNRainbowRn.sharedManager().getConfigurationForCurrentHost(),
         let appId = defaultConfig["APP_ID"] as? String,
         let secretKey = defaultConfig["SEC_KEY"] as? String {
        ServicesManager.sharedInstance().setAppID(appId, secretKey: secretKey)
      }
    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
/// Convert deviceToken (NSData) into hex string
    func hexString(from data: Data) -> String {
        return data.map { String(format: "%02X", $0) }.joined()
    }
    
/// Called when APNs successfully registers the device
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      let tokenString = hexString(from: deviceToken)
      NSLog("[AppDelegate] didRegisterForRemoteNotificationsWithDeviceToken deviceToken='%@'", tokenString)
      
      ServicesManager.sharedInstance().notificationsManager.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
  }
  
  /// Called when APNs fails to register the device
  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
      NSLog("[AppDelegate] Failed to register for remote notifications: %@", error.localizedDescription)
  }
  
  /// Called when a remote notification is received
  func application(_ application: UIApplication,
                   didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
      NSLog("[AppDelegate] received a push notification")
    ServicesManager.sharedInstance().notificationsManager.didReceiveNotification(userInfo: userInfo)
      completionHandler(.noData)
  }
