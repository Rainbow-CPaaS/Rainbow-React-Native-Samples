//
//  NotificationService.m
//  notificationSetup
//
//  Created by Doha Tubaileh on 25/07/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "NotificationService.h"
#import <RNRainbowRn.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  self.contentHandler = contentHandler;
  self.bestAttemptContent = [request.content mutableCopy];
  NSDictionary *userInfo = _bestAttemptContent.userInfo;
  // Check if the notification message is encrypted
  if ([userInfo valueForKeyPath:@"aps.crypt"]) {
    NSLog(@"Encrypted Notification Message: %@",userInfo);
    NotificationsManager *rainbowNotificationManager = [ServicesManager sharedInstance].notificationsManager;
    userInfo = [rainbowNotificationManager decryptNotificationContentWithUserInfo:userInfo];
    NSLog(@"Decripted Notification Message: %@",userInfo);
    _bestAttemptContent.userInfo = userInfo;
    // Refill bestAttemptContent with the updated data
    NSString *title = [userInfo valueForKeyPath:@"aps.alert.title"];
    _bestAttemptContent.title = title;
    NSString *body = [userInfo valueForKeyPath:@"aps.alert.body"];
    _bestAttemptContent.body = body;
  }
  
  // Modify the notification content here...
  self.bestAttemptContent.title = [NSString stringWithFormat:@"%@ [modified]", self.bestAttemptContent.title];
  
  self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
