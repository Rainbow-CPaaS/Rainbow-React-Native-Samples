/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNRainbowRn.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //register AppCenter
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  //register notification
  [[ServicesManager sharedInstance].notificationsManager registerForUserNotificationsSettingsWithCompletionHandler:^(BOOL granted, NSError * _Nullable error) {
    if(error){
      NSLog(@"registerForUserNotificationsSettingsWithCompletionHandler returned a error: %@", [error localizedDescription]);
    } else if(granted){
      NSLog(@"Push notifications granted");
    } else {
      NSLog(@"Push notifications not granted");
    }
  }];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"RainbowModuleExample"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }


  [[RNRainbowRn sharedManager] initRainbowServiceManager:bridge];


  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;

  UINavigationController *rootNavigationController = [[RNRainbowRn sharedManager] setupRainbowRootController:rootViewController];
  self.window.rootViewController = rootNavigationController;

  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Push notifications

- (NSString *)hexString:(NSData *)data {
  NSMutableString *string = [NSMutableString stringWithCapacity:data.length * 3];
  [data enumerateByteRangesUsingBlock:^(const void *bytes, NSRange byteRange, BOOL *stop){
    for (NSUInteger offset = 0; offset < byteRange.length; ++offset) {
      uint8_t byte = ((const uint8_t *)bytes)[offset];
      [string appendFormat:@"%02X", byte];
    }
  }];
  return string;
}

-(void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"[AppDelegate] didRegisterForRemoteNotificationsWithDeviceToken deviceToken='%@'", [self hexString:deviceToken]);
  [[ServicesManager sharedInstance].notificationsManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

-(void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"[AppDelegate] User refuse to enable push notification");
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *) userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"[AppDelegate] received a push notification");
  [[ServicesManager sharedInstance].notificationsManager didReceiveNotificationWithUserInfo:userInfo];
  completionHandler(UIBackgroundFetchResultNoData);
}

@end
