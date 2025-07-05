// content.js - Stealth interaction system
(function() {
  'use strict';
  
  // Stealth mode configurations
  const STEALTH_CONFIG = {
    humanDelay: () => Math.random() * 200 + 100, // 100-300ms random delay
    maxAttempts: 20,
    retryDelay: 500,
    observerTimeout: 10000
  };
  
  // Anti-detection measures
  const stealthMode = {
    // Hide automation traces
    hideAutomation: () => {
      // Remove webdriver properties
      delete navigator.__proto__.webdriver;
      
      // Override automation detection methods
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Hide chrome runtime
      if (window.chrome && window.chrome.runtime) {
        delete window.chrome.runtime.onConnect;
        delete window.chrome.runtime.onMessage;
      }
    },
    
    // Simulate human-like behavior
    addRandomness: () => {
      // Add slight mouse movement
      const moveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: Math.random() * window.innerWidth,
        clientY: Math.random() * window.innerHeight
      });
      document.dispatchEvent(moveEvent);
    },
    
    // Create realistic click sequence
    humanClick: (element) => {
      return new Promise((resolve) => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 10;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 10;
        
        const events = [
          new MouseEvent('mouseenter', {bubbles: true, clientX: x, clientY: y}),
          new MouseEvent('mouseover', {bubbles: true, clientX: x, clientY: y}),
          new MouseEvent('mousedown', {bubbles: true, cancelable: true, clientX: x, clientY: y}),
          new MouseEvent('mouseup', {bubbles: true, cancelable: true, clientX: x, clientY: y}),
          new MouseEvent('click', {bubbles: true, cancelable: true, clientX: x, clientY: y})
        ];
        
        let eventIndex = 0;
        const dispatchNext = () => {
          if (eventIndex < events.length) {
            element.dispatchEvent(events[eventIndex]);
            eventIndex++;
            setTimeout(dispatchNext, STEALTH_CONFIG.humanDelay() / events.length);
          } else {
            // Also trigger native click
            if (element.click) element.click();
            resolve(true);
          }
        };
        
        dispatchNext();
      });
    }
  };
  
  // Initialize stealth mode
  stealthMode.hideAutomation();
  
  // Enhanced element detection with stealth
  const findClickableElements = () => {
    const selectors = [
      // Google-specific selectors
      'a[href*="vertexaisearch.cloud.google.com"]',
      'a[href*="redirect"]',
      '.redirectLink',
      '#proceed-link',
      '.redirect-link',
      
      // Generic selectors
      'a[href]:not([href^="javascript:"]):not([href="#"])',
      'button:not([disabled])',
      '[role="button"]:not([disabled])',
      'input[type="submit"]:not([disabled])',
      'input[type="button"]:not([disabled])',
      '.btn:not([disabled])',
      '.button:not([disabled])',
      '[onclick]:not([disabled])'
    ];
    
    const elements = [];
    
    for (const selector of selectors) {
      try {
        const found = document.querySelectorAll(selector);
        for (const element of found) {
          if (isElementClickable(element)) {
            elements.push({
              element,
              priority: getPriority(element, selector),
              selector
            });
          }
        }
      } catch (e) {
        console.debug('Selector failed:', selector, e);
      }
    }
    
    // Sort by priority (higher is better)
    return elements.sort((a, b) => b.priority - a.priority);
  };
  
  const isElementClickable = (element) => {
    if (!element || element.offsetParent === null) return false;
    if (element.disabled || element.hasAttribute('disabled')) return false;
    if (element.hasAttribute('data-clicked')) return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (parseFloat(style.opacity) < 0.1) return false;
    
    return true;
  };
  
  const getPriority = (element, selector) => {
    let priority = 0;
    
    // Higher priority for vertex-specific links
    if (element.href && element.href.includes('vertexaisearch.cloud.google.com')) priority += 100;
    if (element.textContent && element.textContent.toLowerCase().includes('continue')) priority += 50;
    if (element.textContent && element.textContent.toLowerCase().includes('proceed')) priority += 50;
    if (element.id && element.id.includes('redirect')) priority += 30;
    if (element.className && element.className.includes('redirect')) priority += 30;
    
    // Penalize potential navigation elements
    if (element.textContent && element.textContent.toLowerCase().includes('back')) priority -= 20;
    if (element.textContent && element.textContent.toLowerCase().includes('cancel')) priority -= 20;
    
    return priority;
  };
  
  // Main clicking logic with stealth
  const performStealthClick = async () => {
    console.log('🎯 Starting stealth click operation...');
    
    // Add human-like behavior
    stealthMode.addRandomness();
    
    const clickableElements = findClickableElements();
    console.log(`Found ${clickableElements.length} clickable elements`);
    
    if (clickableElements.length === 0) return false;
    
    // Try highest priority element first
    const target = clickableElements[0];
    console.log('🎯 Targeting element:', target.element, 'with selector:', target.selector);
    
    // Mark as clicked
    target.element.setAttribute('data-clicked', 'true');
    
    // Perform stealth click
    try {
      await stealthMode.humanClick(target.element);
      console.log('✅ Successfully clicked element');
      return true;
    } catch (error) {
      console.error('❌ Click failed:', error);
      return false;
    }
  };
  
  // Enhanced URL handling
  const handleUrlRedirect = () => {
    const currentUrl = window.location.href;
    const targetUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/';
    
    // Check if we're on a Google redirect page
    if (currentUrl.includes('google.com/url') || currentUrl.includes('accounts.google.com')) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('url') || urlParams.get('q') || urlParams.get('continue');
      
      if (redirectUrl && redirectUrl.includes('vertexaisearch.cloud.google.com')) {
        console.log('🔀 Detected Google redirect, navigating to:', redirectUrl);
        setTimeout(() => {
          window.location.replace(decodeURIComponent(redirectUrl));
        }, STEALTH_CONFIG.humanDelay());
        return true;
      }
    }
    
    // Direct redirect if not on target
    if (currentUrl !== targetUrl && currentUrl.includes('vertexaisearch.cloud.google.com')) {
      console.log('🔀 Redirecting to target URL');
      setTimeout(() => {
        window.location.replace(targetUrl);
      }, STEALTH_CONFIG.humanDelay());
      return true;
    }
    
    return false;
  };
  
  // Main execution logic
  const executeStealthOperation = async () => {
    console.log('🚀 Initializing stealth operation...');
    
    // First, handle any URL redirects
    if (handleUrlRedirect()) {
      return; // URL redirect in progress
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve, {once: true});
      });
    }
    
    // Add human-like delay
    await new Promise(resolve => setTimeout(resolve, STEALTH_CONFIG.humanDelay()));
    
    // Attempt to click
    let attempts = 0;
    let success = false;
    
    while (attempts < STEALTH_CONFIG.maxAttempts && !success) {
      attempts++;
      console.log(`🎯 Attempt ${attempts}/${STEALTH_CONFIG.maxAttempts}`);
      
      success = await performStealthClick();
      
      if (!success) {
        await new Promise(resolve => setTimeout(resolve, STEALTH_CONFIG.retryDelay));
      }
    }
    
    if (!success) {
      console.log('⚠️ All click attempts failed, monitoring for dynamic content...');
      setupDynamicContentMonitor();
    }
  };
  
  // Monitor for dynamically loaded content
  const setupDynamicContentMonitor = () => {
    const observer = new MutationObserver(async (mutations) => {
      let hasNewClickableContent = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const clickables = findClickableElements();
              if (clickables.length > 0) {
                hasNewClickableContent = true;
                break;
              }
            }
          }
        }
      }
      
      if (hasNewClickableContent) {
        console.log('🔄 New clickable content detected');
        observer.disconnect();
        
        await new Promise(resolve => setTimeout(resolve, STEALTH_CONFIG.humanDelay()));
        await performStealthClick();
      }
    });
    
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
    
    // Cleanup after timeout
    setTimeout(() => {
      observer.disconnect();
      console.log('⏰ Dynamic content monitoring timed out');
    }, STEALTH_CONFIG.observerTimeout);
  };
  
  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeStealthOperation);
  } else {
    setTimeout(executeStealthOperation, STEALTH_CONFIG.humanDelay());
  }
  
})();