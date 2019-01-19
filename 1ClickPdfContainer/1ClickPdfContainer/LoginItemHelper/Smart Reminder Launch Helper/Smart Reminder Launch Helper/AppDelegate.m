//
//  AppDelegate.m
//  Smart Reminder Launch Helper
//
//  Created by Satendra Dagar on 21/09/15.
//  Copyright (c) 2015 CoreBits Software Solutions Pvt. Ltd. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()

@property (weak) IBOutlet NSWindow *window;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Insert code here to initialize your application
    NSArray *pathComponents = [[[NSBundle mainBundle] bundlePath] pathComponents];
    NSLog(pathComponents);
    pathComponents = [pathComponents subarrayWithRange:NSMakeRange(0, [pathComponents count] - 4)];
    NSString *path = [NSString pathWithComponents:pathComponents];
    NSLog(@"Launch app at path: %@",path);
//    [[NSWorkspace sharedWorkspace] launchApplication:path];
//    [NSApp terminate:nil];
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    // Insert code here to tear down your application
}

@end
