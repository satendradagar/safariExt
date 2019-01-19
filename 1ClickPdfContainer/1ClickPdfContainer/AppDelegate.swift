//
//  AppDelegate.swift
//  1ClickPdfContainer
//
//  Created by Satendra Dagar on 20/10/18.
//  Copyright © 2018 COREBITS. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {



    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Insert code here to initialize your application
        print(Bundle.main.bundlePath)
        checkAndMoveApp()
     }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    func checkAndMoveApp() -> Void {
        
        let comps = Bundle.main.bundlePath.components(separatedBy: "/")
        let parent = comps[comps.count - 2]
        print(parent)
        if parent != "Applications" {
            launchHelper()
            exit(0)
        }
    }
    
    func launchHelper() -> Void {
      let helperPath =   "\(Bundle.main.bundlePath)/Contents/Library/LoginItems/Smart Reminder Launch Helper.app"
        NSWorkspace.shared.open(URL(fileURLWithPath: helperPath))
    }
}

