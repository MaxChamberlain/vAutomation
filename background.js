let relevantTabId

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    let url = tab.url
    if(url.includes('vauto.com/Va/Appraisal/')) {
        chrome.storage.local.set({relevantTabId: tab.id})
        chrome.scripting.executeScript(tab.id, {file: 'contentscript.js'})
    } else if (url.split('=').slice(0, -1).join('') === 'https://www.cargurus.com/Cars/instantMarketValueFromVIN.action?startUrl%2FCars%2FinstantMarketValueFromVIN.action&++++++++carDescription.vin%0D%0A'){
        chrome.scripting.executeScript(tab.id, {file: 'cargurusscript.js'})
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.storage.local.get('relevantTabId').then(e => console.log(e))
    if(request.priceTarget) {
        chrome.storage.local.get('relevantTabId').then(e => chrome.tabs.sendMessage(e.relevantTabId, {priceTarget: request.priceTarget}))
    }
})