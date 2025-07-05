# Redirect Noticeless Extension v2.0

## 🚀 Advanced Anti-Detection Browser Extension

This Firefox extension intelligently bypasses Google's redirect notices and anti-automation measures, allowing seamless navigation to your intended destinations without manual intervention.

### Key Features:
- **Stealth Mode**: Advanced anti-detection techniques that hide automation traces
- **Human Simulation**: Realistic delays, mouse movements, and interaction patterns  
- **Intelligent Targeting**: Smart element detection and priority-based clicking
- **Multi-Pattern Support**: Handles various Google redirect URL formats
- **Dynamic Adaptation**: Responds to changing website structures and async content

## Supported Domains

The extension automatically activates on:
- `vertexaisearch.cloud.google.com/*` 
- `www.google.com/url*`
- `google.com/url*`
- `accounts.google.com/*`

## Installation Guide

### Method 1: Temporary Installation (Recommended for Testing)
1. Open Firefox browser
2. Navigate to `about:debugging` in the address bar
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Browse to the extension folder: `/Users/rizkia/redirectnoticeless/`
6. Select the `manifest.json` file
7. Extension will be active until Firefox restarts

### Method 2: Permanent Installation (Developer Mode)
1. Open Firefox and go to `about:config`
2. Search for `xpinstall.signatures.required` and set to `false`
3. Package the extension:
   - Create a ZIP archive of all files in the extension directory
   - Rename the ZIP file with a `.xpi` extension
4. Drag and drop the `.xpi` file into Firefox
5. Click "Add" when prompted to confirm installation

## 🛡️ Technical Implementation

### Anti-Detection Techniques
The extension employs multiple sophisticated bypass methods:

1. **WebDriver Obfuscation**: Removes automation signatures and browser fingerprints
2. **Request Interception**: Monitors and processes redirect URLs before execution  
3. **Stealth Injection**: Dynamically injects anti-detection code via `stealth.js`
4. **Behavioral Mimicry**: Simulates human-like interaction patterns and timing
5. **Element Prioritization**: Intelligently selects the most relevant clickable elements

### Architecture Components

**Background Script (`background.js`)**
- Handles URL redirection logic
- Manages tab navigation and state
- Coordinates between content scripts

**Content Script (`content.js`)**  
- Performs page interaction and element clicking
- Implements retry logic and error handling
- Monitors dynamic content loading

**Stealth Module (`stealth.js`)**
- Advanced anti-detection techniques
- Browser fingerprint modification
- Automation signature removal

**Manifest (`manifest.json`)**
- Extension configuration and permissions
- Content script injection rules
- Resource declarations

## Permissions Required

- `activeTab`: Access to currently active tab
- `tabs`: Tab management and navigation
- `webNavigation`: Monitor navigation events
- `webRequest` & `webRequestBlocking`: Request interception
- `*://*/*`: Universal domain access for redirect handling

## Troubleshooting

**Extension Not Working:**
1. Verify extension is enabled in `about:addons`
2. Check browser console (F12) for error messages
3. Refresh the target page to retrigger detection
4. Ensure website structure hasn't changed significantly

**Common Issues:**
- **Slow Response**: Extension includes intentional delays to mimic human behavior
- **Multiple Attempts**: Retry logic may take several seconds to find correct elements
- **Page Changes**: Dynamic websites may require updated selectors

## Development Notes

This extension uses Manifest V2 for compatibility with Firefox's extension system. The stealth techniques are designed to be undetectable by standard anti-automation measures while maintaining legitimate browsing behavior.

**File Structure:**
```
/Users/rizkia/redirectnoticeless/
├── manifest.json       # Extension configuration
├── background.js       # Background script for URL handling
├── content.js         # Content script for page interaction
├── stealth.js         # Anti-detection techniques
└── README.md          # This documentation
```

## Security & Ethics

This extension is designed for legitimate use cases where redirect notices impede normal browsing. Users should comply with website terms of service and applicable laws. The extension does not collect or transmit any user data.
