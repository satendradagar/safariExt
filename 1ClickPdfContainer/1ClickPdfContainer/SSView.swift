//
//  SSView.swift
//  intelliSheets
//
//  Created by Satendra Singh on 27/11/16.
//  Copyright © 2016 Satendra Singh. All rights reserved.
//

import Foundation
import Cocoa

class SSView: NSView {
    
    @IBInspectable var backgroundColor:NSColor?
        
    override func draw(_ dirtyRect: NSRect) {
        
        if (backgroundColor != nil) {
         
            self.backgroundColor?.setFill();
            __NSRectFill(dirtyRect);
      
        }
        super.draw(dirtyRect);
    }
}
