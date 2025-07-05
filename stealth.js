// stealth.js - Advanced anti-detection techniques
(function() {
  'use strict';
  
  // Advanced stealth techniques to bypass Google's detection
  const stealthTechniques = {
    // Override webdriver detection
    hideWebDriver: () => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        configurable: true
      });
      
      // Hide automation indicators
      delete window.chrome;
      delete window.domAutomation;
      delete window.domAutomationController;
      
      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });
      
      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });
    },
    
    // Spoof timing functions to appear more human
    spoofTiming: () => {
      const originalSetTimeout = window.setTimeout;
      const originalSetInterval = window.setInterval;
      
      window.setTimeout = function(callback, delay, ...args) {
        // Add slight randomness to timing
        const randomDelay = delay + Math.random() * 50 - 25;
        return originalSetTimeout.call(this, callback, Math.max(0, randomDelay), ...args);
      };
      
      window.setInterval = function(callback, delay, ...args) {
        const randomDelay = delay + Math.random() * 100 - 50;
        return originalSetInterval.call(this, callback, Math.max(1, randomDelay), ...args);
      };
    },
    
    // Override mouse events to add subtle randomness
    humanizeEvents: () => {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click' && typeof listener === 'function') {
          const humanizedListener = function(event) {
            // Add slight delay to make it seem more human
            setTimeout(() => {
              listener.call(this, event);
            }, Math.random() * 10);
          };
          
          return originalAddEventListener.call(this, type, humanizedListener, options);
        }
        
        return originalAddEventListener.call(this, type, listener, options);
      };
    },
    
    // Hide extension traces
    hideExtensionTraces: () => {
      // Remove common extension detection markers
      const scripts = document.querySelectorAll('script[src*="extension://"]');
      scripts.forEach(script => script.remove());
      
      // Hide runtime if it exists
      if (window.chrome && window.chrome.runtime) {
        const backup = window.chrome.runtime;
        delete window.chrome.runtime;
        
        // Restore only safe methods
        window.chrome.runtime = {
          onMessage: backup.onMessage,
          sendMessage: backup.sendMessage
        };
      }
    },
    
    // Simulate real user viewport and screen properties
    spoofViewport: () => {
      // Override screen properties to look realistic
      Object.defineProperties(screen, {
        availHeight: { value: 1040 },
        availWidth: { value: 1920 },
        height: { value: 1080 },
        width: { value: 1920 },
        colorDepth: { value: 24 },
        pixelDepth: { value: 24 }
      });
      
      // Override window properties
      Object.defineProperties(window, {
        outerHeight: { value: 1080 },
        outerWidth: { value: 1920 },
        devicePixelRatio: { value: 1 }
      });
    }
  };
  
  // Apply all stealth techniques
  const initializeStealth = () => {
    try {
      stealthTechniques.hideWebDriver();
      stealthTechniques.spoofTiming();
      stealthTechniques.humanizeEvents();
      stealthTechniques.hideExtensionTraces();
      stealthTechniques.spoofViewport();
      
      console.log('🥷 Stealth mode activated');
    } catch (error) {
      console.error('❌ Stealth initialization failed:', error);
    }
  };
  
  // Initialize immediately
  initializeStealth();
  
  // Also initialize after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStealth);
  }
  
})();