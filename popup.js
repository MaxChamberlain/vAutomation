var bgp = chrome.extension.getBackgroundPage()

document.addEventListener('DOMContentLoaded', function () {
  var btadd = document.getElementById("get_btn");
  btadd.addEventListener('click', startScraper);
  var btnput = document.getElementById("set_btn");
  btnput.addEventListener('click', putData);

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      url = url.split('?')[0]
      let expectedUrls = 'https://www2.vauto.com/Va/Inventory/ http://localhost:5173/documents https://maxautolytics.com/documents https://dealer-trk.netlify.app/documents'
      if(!expectedUrls.includes(url)){
          document.getElementById('status_title').innerText = 'Wrong page'
          document.getElementById("get_btn").disabled = true;
          document.getElementById('get_btn').style.opacity = '60%'
          document.getElementById("set_btn").disabled = true;
          document.getElementById('set_btn').style.opacity = '60%'
          document.getElementById('status').innerText = "Make sure you're in either the VAuto Inventory page\nor the Max Autolytics \"list\" page"
      }
  });
})

chrome.storage.local.get('metrics', function(result) {
    if(result && result.metrics){
        document.getElementById('status').innerText = result.metrics.v_vehicle + ' (' + result.metrics.v_stock_no + ')'
        document.getElementById("set_btn").disabled = false;
    } else {
        document.getElementById('status').innerText = 'No data'
        document.getElementById("set_btn").disabled = true;
        document.getElementById('set_btn').style.opacity = '60%'
    }
})

function startScraper(e){
    chrome.runtime.sendMessage({ type: 'grab' })
    e.target.innerText = 'Cancel Getting Data'
    e.target.removeEventListener('click', startScraper)
    e.target.addEventListener('click', cancelScraper)
}

function cancelScraper(e){
    chrome.runtime.sendMessage({ type: 'cancel-scrape' })
    e.target.innerText = 'Grab Vehicle Details'
    e.target.removeEventListener('click', cancelScraper)
    e.target.addEventListener('click', startScraper)
}

function putData(e){
    console.log('putting data')
    chrome.runtime.sendMessage({ type: 'put-data' })
    setTimeout(() => window.close(), 100)
}