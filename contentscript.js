try{
    let input_element_vautomation_styles = document.createElement('style')
    input_element_vautomation_styles.innerHTML = `
    #input_element_vautomation {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        display: none;
        justify-content: center;
        align-items: center;
    }
    #input_element_vautomation_inner {
        width: 400px;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
        position: relative;
        color: black;
    }
    #vautomation_generate_button, #vautomation_generate_set_button{
        width: 100%;
        height: 50px;
        background-color: hsl(220, 100%, 60%);
        color: white;
        font-size: 1.25em;
    }
    #vautomation_close_listener {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 1.5em;
        font-weight: bold;
    }
    .vautomation_input_container > input, .vautomation_input_container > select {
        width: 100%;
        height: 35px;
        font-size: 1em;
        padding: 0px 5px;
        margin-bottom: 10px;
    }
    .vautomation_input_container > label {
        font-size: 0.8em;
        font-weight: bold;
        margin-bottom: 5px;
        display: block;
    }
    .vautomation_flex_container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .vautomation_input_container{
        width: 48%;
    }
    `

    let input_element_vautomation = document.createElement('div')
    input_element_vautomation.id = 'input_element_vautomation'
    input_element_vautomation.innerHTML = `
        <div id="input_element_vautomation_inner">
            <div id="vautomation_close_listener">
                X
            </div>
            <div>
            <div class="vautomation_input_container">
                <label for="OriginalSuggestedPrice">Suggested Price</label>
                <input id="vautomation_OriginalSuggestedPrice" type="number" placeholder="Original Suggested Price" />
            </div>
            <div class="vautomation_flex_container">
                <div class="vautomation_input_container">
                    <label for="carg_h">Cargurus Price</label>
                    <input id="carg_h" type="number" placeholder="Cargurus Number" />
                </div>
                <div class="vautomation_input_container">
                    <label for="carg_level">Cargurus Level</label>
                    <select id="carg_level">
                        <option value="greatPrice">Great Price</option>
                        <option value="goodPrice">Good Price</option>
                        <option value="fairPrice">Fair Price</option>
                        <option value="highPrice">High Price</option>
                        <option value="overPrice">Overprice</option>
                    </select>
                </div>
            </div>
            <a href="#" id="cargurus_link" style="margin-top: -10px; margin-bottom: 10px;">Open a CarGurus Instance</a>
            <div class="vautomation_flex_container">
                <div class="vautomation_input_container">
                    <label for="MMR">MMR</label>
                    <input id="vautomation_MMR" type="number" placeholder="MMR" />
                </div>
                <div class="vautomation_input_container">
                    <label for="MSRP">MSRP</label>
                    <input id="vautomation_MSRP" type="number" placeholder="MSRP" />
                </div>
            </div>
            <div class="vautomation_flex_container">
                <div class="vautomation_input_container">
                    <label for="OriginalSuggestedPercent">Suggested Percent</label>
                    <input id="vautomation_OriginalSuggestedPercent" type="number" placeholder="Original Suggested Percent" />
                </div>
                <div class="vautomation_input_container">
                    <label for="OriginalSuggestedRadius">Suggested Radius (Miles)</label>
                    <input id="vautomation_OriginalSuggestedRadius" type="number" placeholder="Original Suggested Radius" />
                </div>
            </div>
            <button id="vautomation_generate_set_button">Generate</button>
        </div>
    `
    document.body.appendChild(input_element_vautomation)
    document.getElementById('vautomation_close_listener').addEventListener('click', () => {
        input_element_vautomation.style.display = 'none'
    })

    let vautomation_generate_button = document.createElement('button')
    vautomation_generate_button.id = 'vautomation_generate_button'
    vautomation_generate_button.innerText = 'Generate'
    vautomation_generate_button.addEventListener('click', () => {
        let original_suggested_price = document.getElementById('AskingPriceField_Retail')?.value || ''
        let effective_percent_of_market = document.getElementById('EffectivePercentOfMarket_Retail')?.value || ''
        let effective_radius = document.getElementById('distanceCombo')?.value || ''
        let mmr
        document.querySelectorAll('.priceItems').forEach(e => {
            console.log(e.innerText)
            if(e.innerText.includes('Wholesale')){
                e.querySelectorAll('td').forEach(e => {
                    if(e.innerText.includes('$')){
                        mmr = e.innerText.replace(/[^0-9.]/g, '')
                    }
                })
            }
        })
        
        document.getElementById('vautomation_OriginalSuggestedPrice').value = original_suggested_price
        document.getElementById('vautomation_OriginalSuggestedPercent').value = effective_percent_of_market
        document.getElementById('vautomation_OriginalSuggestedRadius').value = effective_radius
        document.getElementById('vautomation_MMR').value = mmr || ''
        
        input_element_vautomation.style.display = 'flex'


    })
    document.getElementById('cargurus_link').addEventListener('click', () => {
        let vin = document.getElementById('Vin')?.value || ''
        let odometer = document.getElementById('Odometer')?.value || ''
        getCarGurus(vin, odometer)
    })


    document.getElementById('vautomation_generate_set_button').addEventListener('click', () => {
        let string = document.getElementById('vautomation_OriginalSuggestedPrice')?.value || ''
        if(document.getElementById('carg_h')?.value && document.getElementById('carg_level')?.value) {
            let level 
            switch(document.getElementById('carg_level').value){
                case 'greatPrice':
                    level = 'GR'
                    break
                case 'goodPrice':
                    level = 'G'
                    break
                case 'fairPrice':
                    level = 'IMV'
                    break
                case 'highPrice':
                    level = 'H'
                    break
                case 'overPrice':
                    level = 'OP'
                    break
            }
            if(level) string += ` ${level} ${document.getElementById('carg_h').value}`
        }
        if(document.getElementById('vautomation_MMR')?.value) string += ` MMR ${document.getElementById('vautomation_MMR').value}`
        if(document.getElementById('vautomation_MSRP')?.value) string += ` MSRP ${document.getElementById('vautomation_MSRP').value}`
        if(document.getElementById('vautomation_OriginalSuggestedPercent')?.value) string += ` ${document.getElementById('vautomation_OriginalSuggestedPercent').value}%`
        if(document.getElementById('vautomation_OriginalSuggestedRadius')?.value) string += ` ${document.getElementById('vautomation_OriginalSuggestedRadius').value}M`

        document.querySelector('.comment-no-photo textarea').value = string
        input_element_vautomation.style.display = 'none'
    })

    document.querySelectorAll('.x-table-layout-cell > #Comments_Panel').forEach(e => {
        e.addEventListener('click', () => {
            setTimeout(() => {
                e.querySelectorAll('.x-panel-bwrap > .comments').forEach(e => {
                    e.appendChild(vautomation_generate_button, e)
                })
            }, 100)
        })
    })

    document.head.appendChild(input_element_vautomation_styles)
} catch(e) {
    console.log(e)
}

function getCarGurus(vin, odometer) {
    window.open(
      `https://www.cargurus.com/Cars/instantMarketValueFromVIN.action?startUrl=%2FCars%2FinstantMarketValueFromVIN.action&++++++++carDescription.vin%0D%0A=${vin}&odometer=${odometer}`, 
      '', 
      'locked=yes'
    );

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.priceTarget) {
            document.getElementById('carg_level').value = request.priceTarget[0]
            document.getElementById('carg_h').value = request.priceTarget[1]
        }
    })
    
};

