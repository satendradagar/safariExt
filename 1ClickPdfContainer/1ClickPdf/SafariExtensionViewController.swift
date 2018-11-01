//
//  SafariExtensionViewController.swift
//  1ClickPdf
//
//  Created by Satendra Dagar on 20/10/18.
//  Copyright © 2018 COREBITS. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
