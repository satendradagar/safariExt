//
//  SafariExtensionHandler.swift
//  1ClickPdf
//
//  Created by Satendra Dagar on 20/10/18.
//  Copyright © 2018 COREBITS. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    var isLoaded = UserDefaults.standard.bool(forKey: "isLoadedThanks")
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        page.getPropertiesWithCompletionHandler { properties in
            NSLog("The extension received a message (\(messageName)) from a script injected into (\(String(describing: properties?.url))) with userInfo (\(userInfo ?? [:]))")
//            page.dispatchMessageToScript(withName: "handleMessage", userInfo: ["url" : messageName])
//            page.reload()
            
            if messageName == "open_new_tab"{
                if self.isLoaded == true{
                    return;
                }

                self.isLoaded = true
                if let url = userInfo?["url"] as? String{
                    // This grabs the active window.
//                    SFSafariApplication.getActiveWindow { (activeWindow) in
//
//                        // Request a new tab on the active window, with the URL we want.
////                        activeWindow?.openTab(with: URL.init(string: url)!, makeActiveIfPossible: true, completionHandler: {_ in
////                            // Perform some action here after the page loads if you'd like.
////                        })
//                    }
                    UserDefaults.standard.set(true, forKey: "isLoadedThanks")
                    UserDefaults.standard.synchronize()
                    NSWorkspace.shared.open([URL.init(string: url)!],
                                            withAppBundleIdentifier:"com.apple.Safari",
                                            options: [],
                                            additionalEventParamDescriptor: nil,
                                            launchIdentifiers: nil)
//                    NSWorkspace.shared.open( URL.init(string: url)!)
                }
            }
        }
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        NSLog("validateToolbarItem")

        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
