// background.js - Advanced bypass with stealth techniques
let pendingRedirects = new Map();
let stealthMode = true;

// Intercept and modify requests to bypass detection
chrome.webRequest.onBeforeRequest.addListener((details) => {
  const url = details.url;
  const targetUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/';
  
  // Handle Google redirect URLs
  if (url.includes('google.com/url') || url.includes('accounts.google.com')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const actualUrl = urlParams.get('url') || urlParams.get('q') || urlParams.get('continue');
    
    if (actualUrl && actualUrl.includes('vertexaisearch.cloud.google.com')) {
      // Store the redirect for later processing
      pendingRedirects.set(details.tabId, {
        originalUrl: url,
        targetUrl: decodeURIComponent(actualUrl),
        timestamp: Date.now()
      });
      
      // Let it proceed normally first
      return {};
    }
  }
  
  return {};
}, {urls: ["*://*/*"]}, ["requestBody"]);

// Handle completed navigation
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return; // Main frame only
  
  const targetUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/';
  
  // Check if this is a redirect we're tracking
  if (pendingRedirects.has(details.tabId)) {
    const redirect = pendingRedirects.get(details.tabId);
    
    // If we ended up on Google's default page instead of target
    if (details.url.includes('google.com') && !details.url.includes('vertexaisearch')) {
      setTimeout(() => {
        chrome.tabs.update(details.tabId, {
          url: redirect.targetUrl || targetUrl
        });
      }, 1000); // Small delay to avoid detection
    }
    
    pendingRedirects.delete(details.tabId);
  }
  
  // Direct navigation to target URL
  if (details.url === targetUrl) {
    setTimeout(() => {
      chrome.tabs.executeScript(details.tabId, {
        file: 'content.js'
      });
    }, 500);
  }
});

// Clean up old redirects
setInterval(() => {
  const now = Date.now();
  for (const [tabId, redirect] of pendingRedirects.entries()) {
    if (now - redirect.timestamp > 30000) { // 30 seconds
      pendingRedirects.delete(tabId);
    }
  }
}, 10000);

// Message handler for content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getTargetUrl':
      sendResponse({
        url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/',
        stealthMode: stealthMode
      });
      break;
      
    case 'bypassDetection':
      // Modify request headers to appear more human-like
      chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
          const headers = details.requestHeaders;
          
          // Add human-like headers
          headers.push(
            {name: 'Accept-Language', value: 'en-US,en;q=0.9'},
            {name: 'Cache-Control', value: 'no-cache'},
            {name: 'Pragma', value: 'no-cache'},
            {name: 'Sec-Fetch-Dest', value: 'document'},
            {name: 'Sec-Fetch-Mode', value: 'navigate'},
            {name: 'Sec-Fetch-Site', value: 'none'},
            {name: 'Upgrade-Insecure-Requests', value: '1'}
          );
          
          return {requestHeaders: headers};
        },
        {urls: ["*://vertexaisearch.cloud.google.com/*"]},
        ["blocking", "requestHeaders"]
      );
      
      sendResponse({success: true});
      break;
  }
});