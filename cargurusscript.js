if(window.location.href.includes('cargurus')){
    let targetNode = document.getElementById('priceReport-thermometerPlaceholder');
    
    // Options for the observer (which mutations to observe)
    const config = { childList: true };
     
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes?.length > 0) {
                try{
                    let greatPrice
                    let goodPrice
                    let fairPrice
                    let highPrice
                    let overPrice
                    mutation.addedNodes.forEach(node => {
                        if(node.querySelector){
                            greatPrice = node.querySelector('.cg-priceCheckVerticalScale-great span');
                            goodPrice = node.querySelector('.cg-priceCheckVerticalScale-good span');
                            fairPrice = node.querySelector('.cg-priceCheckVerticalScale-fair span');
                            highPrice = node.querySelector('.cg-priceCheckVerticalScale-poor span');
                            overPrice = node.querySelector('.cg-priceCheckVerticalScale-over span');
                        }
                    })
        
                    console.log(greatPrice, goodPrice, fairPrice, highPrice, overPrice);
                    
                    if(greatPrice && goodPrice && fairPrice && highPrice && overPrice){
                        observer.disconnect();
                        createButton(greatPrice, 
                            greatPrice?.innerText?.replace(/[^0-9.]/g, ''), 'greatPrice');
                        createButton(goodPrice, 
                            goodPrice?.innerText?.replace(/[^0-9.]/g, ''), 'goodPrice');
                        createButton(fairPrice, 
                            fairPrice?.innerText?.replace(/[^0-9.]/g, ''), 'fairPrice');
                        createButton(highPrice, 
                            highPrice?.innerText?.replace(/[^0-9.]/g, ''), 'highPrice');
                        createButton(overPrice, 
                            overPrice?.innerText?.replace(/[^0-9.]/g, ''), 'overPrice');
                        observer.observe(targetNode, config);
                    }
                } catch(err) {
                    console.log('error', err)
                }
            }
        }
    }
    
     
    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);
      
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    
    function createButton(element, value, name) {
        if (element) {
            element.style.minWidth = "100px";
            let button = document.createElement("button");
            button.type = "button";
            button.name = name;
            button.id = name;
            button.style.marginLeft = "10px";
            button.style.marginRight = "10px";
            button.innerText = 'Choose';
            element.parentElement.style.display = "grid";
            element.parentElement.style.width = "500px";
            element.parentElement.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr";
    
            // This is the new code for the button
            button.addEventListener("click", () => {
                let priceTarget = [name, value];
                // get the tab of the window that opened this popup
                chrome.runtime.sendMessage({priceTarget}, function(response) {
                    console.log(response);
                });
                window.close();
            });  
            
            element.parentElement.appendChild(button);
        }
    }

}    
