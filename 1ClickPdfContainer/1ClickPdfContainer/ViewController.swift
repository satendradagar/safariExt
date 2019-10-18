//
//  ViewController.swift
//  1ClickPdfContainer
//
//  Created by Satendra Dagar on 20/10/18.
//  Copyright © 2018 COREBITS. All rights reserved.
//

import Cocoa
import SafariServices

class ViewController: NSViewController {

    var timer: Timer?

    @IBOutlet weak var arrowImageView: NSImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.startTimer()
        arrowImageView.canDrawSubviewsIntoLayer = true
        arrowImageView.imageScaling = .scaleProportionallyDown
        arrowImageView.animates = true
        arrowImageView.image = NSImage(named: "arrow")
//        arrowImageView.image = nsima
        // Do any additional setup after loading the view.
    }
    
    func startTimer() {
        
        if timer == nil {
//            timer = Timer.scheduledTimer(timeInterval: 0.5, target: self, selector: #selector(self.loop), userInfo: nil, repeats: true)
            timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true, block: { (timer) in
                self.openSafariExtensionPreferences()
                DispatchQueue.main.async {
                    self.grabExtensionWindow()
                }
            })
            timer?.fire()
        }
    }
    
    func stopTimer() {
        if timer != nil {
            timer?.invalidate()
            timer = nil
        }
    }
    
    override var representedObject: Any? {
        didSet {
        // Update the view, if already loaded.
        }
    }

    func grabExtensionWindow() -> Void {
        print("Grab Ext Window")
        let workspace = NSWorkspace.shared
//        let activeApps = workspace.runningApplications
//        for app in activeApps {
//            if app.isActive {
                let options = CGWindowListOption(arrayLiteral: CGWindowListOption.excludeDesktopElements, CGWindowListOption.optionOnScreenOnly)
                //                    let windowListInfo = CGWindowListCopyWindowInfo(options, CGWindowID(0))
                
                //                    let listOptions = CGWindowListOption(arrayLiteral: option)
                let windowList : NSArray = CGWindowListCopyWindowInfo(options, CGWindowID(0))!
                for window in windowList {
                    if let winDict = window as? Dictionary<String, Any>{
                        if let appTitle = winDict[kCGWindowOwnerName as String] as? String{
                            
                            if appTitle == "Safari"{
                                if let windowTitle = winDict[kCGWindowName as String] as? String{
                                    if windowTitle == "Extensions"{
                                        print("Found extension")
//                                        print(window)
                                        let bounds = CGRect.init(dictionaryRepresentation: winDict[kCGWindowBounds as String] as! CFDictionary)!
//                                        var currentSize = self.view.frame.size
//                                        currentSize.height = bounds.height
//                                        self.view.frame.size = currentSize
                                        
                                        self.adjustWindowWithBounds(inBounds: bounds)
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                }
//            }
//        }
    }
    
    func adjustWindowWithBounds(inBounds:CGRect)  {
        if let window = self.view.window{
            var bounds = inBounds
            var rect = self.view.frame
            rect.size.height = inBounds.size.height
            window.setFrame(rect, display: true)

            var origin = bounds.origin
            let screenSize = NSScreen.main!.frame.size;

            origin.x = origin.x - self.view.frame.size.width
            origin.y = screenSize.height - origin.y - self.view.frame.size.height
            print("in:\(inBounds.origin) out:\(origin)")
            bounds.origin = origin
            window.setFrameOrigin(bounds.origin )
            self.view.window?.makeKeyAndOrderFront(self)
//            NSApp.activate(ignoringOtherApps: true)
        }
    }
        
        func openSafariExtensionPreferences() {
            SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.CoreBits.smartUnite.1ClickPdf") { (err) in
                print(err ?? "Err")
            }
            SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: "com.CoreBits.smartUnite.1ClickPdf") { (state, err) in
                if let recState = state{
                    if recState.isEnabled{
                        print("Extension Enabled")
                        DispatchQueue.main.async {
                            self.stopTimer()
                            self.view.window?.close()
                        }
                    }
                }
                else{
                    print(err)
                }
            }

    }
}

