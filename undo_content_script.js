if(document.querySelectorAll('#new-borderEl-select-framework') && document.querySelectorAll('#new-borderEl-select-framework').length > 0){
    document.querySelectorAll('#new-borderEl-select-framework').forEach((element) => {
        element.remove();
    });
}
if(document.querySelectorAll('#new-borderEl-select-framework-title') && document.querySelectorAll('#new-borderEl-select-framework-title').length > 0){
    document.querySelectorAll('#new-borderEl-select-framework-title').forEach((element) => {
        chrome.storage.local.get('wasWritten', function (result) {
            if (result && result.wasWritten === true) {
                chrome.storage.local.get('metrics', function (result2) {
                    element.innerText = 'Max Autolytics : got "' + result2.metrics?.v_vehicle + ' (' + result2.metrics?.v_stock_no + ')"'
                    element.style.backgroundColor = 'hsla(103, 100%, 56%, 1)'
                    element.style.color = 'black'
                    setTimeout(() => element.remove(), 5000)
                })
            } else {
                element.remove()
            }
            chrome.storage.local.remove('wasWritten')
        })
    });
}
