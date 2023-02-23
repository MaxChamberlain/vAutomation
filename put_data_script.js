chrome.storage.local.get('metrics', (data) => {
    if(data){
        document.getElementById('invisible-data-input').innerText = JSON.stringify(data.metrics)
        document.getElementById('invisible-data-input').dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }))
    } else {
        console.log('No data')
    }
})