// chrome.runtime.sendMessage({type: 'gathered-metrics-data', data: "test"})

if (document.getElementById('new-borderEl-select-framework-title')) {
    document.getElementById('new-borderEl-select-framework-title').remove();
}
if(document.querySelectorAll('.x-grid3-row-table') && document.querySelectorAll('.x-grid3-row-table').length > 0){
    var css = `
        #new-borderEl-select-framework{
            border: 1px dashed hsl(220, 100%, 60%);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        #new-borderEl-select-framework:hover{
            border: 3px solid hsl(220, 100%, 40%);
            background-color: hsla(220, 100%, 40%, 0.2);
        }
        #new-borderEl-select-framework:hover::before{
            content: 'Select';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            font-weight: 600;
            color: hsl(220, 100%, 40%);
        }
    `;
    var style = document.createElement('style');

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);

    let tableEl = document.querySelectorAll('.x-grid3')
    if(tableEl.length) {
        tableEl = tableEl[0]
        let titleEl = document.createElement('div')
        titleEl.innerText = 'Max Autolytics : Select a Vehicle'
        titleEl.style.fontSize = '1.25em'
        titleEl.style.color = 'white'
        titleEl.style.fontWeight = '600'
        titleEl.style.backgroundColor = 'hsl(220, 100%, 60%)'
        titleEl.style.padding = '1em'
        titleEl.style.marginBottom = '5px'
        titleEl.style.textAlign = 'center'
        titleEl.id = 'new-borderEl-select-framework-title'
        tableEl.insertBefore(titleEl, tableEl.firstChild)
    }
    
    
    document.querySelectorAll('.x-grid3-row-table').forEach((element, index) => {

        let borderEl = document.createElement('div');
        borderEl.id = 'new-borderEl-select-framework';
        borderEl.addEventListener('click', (e) => {
            e.stopPropagation();
            e.target.removeEventListener('click', e => e)
            e.target.style.backgroundColor = '#ccc'
            e.target.style.border = '1px dashed #999'
            e.target.style.cursor = 'default'
            e.target.style.pointerEvents = 'none'
            e.target.style.opacity = '0.7'
            document.getElementById('new-borderEl-select-framework-title').innerText = 'Max Autolytics : Loading...'
            const data = e.target.parentElement;
            
            // this is the elements INSIDE the <tr> element
            let children = data.children[0].children[0].children;
            
            children = Array.from(children);
            children = children.map((child) => {
                let subChildren = child.children[0].children
                subChildren = Array.from(subChildren)
                return subChildren.map((subChild) => subChild)

            }).flat()

            Array.from(children).filter(e => e?.className.includes('ColumnField')).forEach((child, index) => {
                let newChildren = Array.from(child?.children)
                if(newChildren.length) {
                    try{
                        let subChildren = newChildren[0]?.children[0]?.children
                        Array.from(subChildren).forEach(subChild => {
                            if(subChild.children.length > 1){
                                try{
                                    let label = subChild.children[0]?.innerText
                                    let value = subChild.children[1]?.innerText
                                    if(label === 'VIN:'){
                                        fetch('https://www2.vauto.com/Va/Inventory/InventoryData.ashx?QuickSearch=' + value + "&gridSrcName=inventoryDetail&IsExactWordMatch=false&HistoricalDaySpan=7", {
                                            "headers": {
                                                "accept": "application/json, text/javascript, */*; q=0.01",
                                                "accept-language": "en-US,en;q=0.9",
                                                "content-type": "application/json; charset=UTF-8",
                                                "sec-fetch-dest": "empty",
                                                "sec-fetch-mode": "cors",
                                                "sec-fetch-site": "same-origin"
                                            },
                                            "referrer": "https://www2.vauto.com/Va/Inventory/Inventory.aspx",
                                            "referrerPolicy": "strict-origin-when-cross-origin",
                                            ":path": "/Va/Inventory/InventoryData.ashx",
                                            ":scheme": "https",
                                            ":authority": "www2.vauto.com",
                                            "method": "POST",
                                        }).then(e => e.text()).then(e => {
                                            let obj = e.replace(/\\n/g, '')
                                            obj = obj.replace(/new Date\((\d+)\)/g, '$1')
                                            obj = JSON.parse(obj)
                                            if(obj.rows.length === 0){
                                                if(document.querySelectorAll('#new-borderEl-select-framework') && document.querySelectorAll('#new-borderEl-select-framework').length > 0){
                                                    document.querySelectorAll('#new-borderEl-select-framework').forEach((element) => {
                                                        element.remove();
                                                    });
                                                }
                                                document.getElementById('new-borderEl-select-framework-title').innerText = 'Max Autolytics : There was an error. Do you have the "Left Inventory" filter selected?'
                                                document.getElementById('new-borderEl-select-framework-title').style.backgroundColor = 'hsl(0, 100%, 60%)'
                                            }
                                            let returnObj = {}
                                            console.log(obj.rows)
                                            obj.columns.forEach((column, index) => {
                                                returnObj[column] = obj.rows[0][index]
                                            })
                                            return returnObj
                                        }).then(e => {
                                            document.getElementById('new-borderEl-select-framework-title').innerText = 'Max Autolytics : ' + e['VehicleTitle']
                                            let notes = e['AppraisalCommmentRec'] ? JSON.parse(e['AppraisalCommmentRec'])[0]?.comment : undefined
                                            let v_initial_carg_h = ''
                                            let v_initial_carg_level = ''
                                            let v_initial_mmr = ''
                                            let v_msrp = ''
                                            let splitNotes = notes?.split(' ')?.map(e => e)
                                            if(splitNotes){
                                                splitNotes.forEach((note, index) => {
                                                    if(note.toUpperCase() === 'MSRP'){
                                                        v_msrp = splitNotes[index + 1]
                                                    }
                                                    if(note.toUpperCase() === 'MMR'){
                                                        v_initial_mmr = splitNotes[index + 1]
                                                    }
                                                    if(note.toUpperCase() === 'GR'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'greatPrice'
                                                    }
                                                    if(note.toUpperCase() === 'G'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'goodPrice'
                                                    }
                                                    if(note.toUpperCase() === 'F'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'fairPrice'
                                                    }
                                                    if(note.toUpperCase() === 'IMV'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'fairPrice'
                                                    }
                                                    if(note.toUpperCase() === 'H'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'highPrice'
                                                    }
                                                    if(note.toUpperCase() === 'OP'){
                                                        v_initial_carg_h = splitNotes[index + 1]
                                                        v_initial_carg_level = 'overPrice'
                                                    }
            
                                                })
                                            }
                                            let details = {
                                                v_stock_no: e['StockNumber'],
                                                v_miles: e['Odometer'],
                                                v_vehicle: e['VehicleTitle']?.toUpperCase(),
                                                v_vin_no: e['Vin'],
                                                v_source: e['VehicleSource'],
                                                v_zip: e['AppraisedPostalCode'],
                                                v_is_certified: e['IsCertified'] === 1 ? true : false,
                                                v_notes: notes,
                                                v_days: e['DaysInInventory'],
                                                v_final_acv: e['TotalCost'],
                                                v_acv: e['AppraisedValue'],
                                                v_final_mmr: e['Manheim_Wholesale'],
                                                v_start_price: e['ListPrice'],
                                                v_sell_price: e['SourceListPrice'],
                                                v_market_percent: e['EffectivePercentOfMarket'] ? Math.round(e['EffectivePercentOfMarket'] * 100) : undefined,
                                                v_initial_carg_h,
                                                v_initial_carg_level,
                                                v_initial_mmr,
                                                v_msrp
                                            }   
                                            console.log(details)
                                            chrome.runtime.sendMessage({ type: 'gathered-metrics-data', data: details})
                                        })
                                    }
                                } catch(e) {
                                    console.log(e)
                                    if(document.querySelectorAll('#new-borderEl-select-framework') && document.querySelectorAll('#new-borderEl-select-framework').length > 0){
                                        document.querySelectorAll('#new-borderEl-select-framework').forEach((element) => {
                                            element.remove();
                                        });
                                    }
                                    document.getElementById('new-borderEl-select-framework-title').innerText = 'Max Autolytics : There was an error. Do you have the "Left Inventory" filter selected?'
                                }
                            }
                        })
                    }catch(e){
                        console.log(e)
                    }
                }
            })
        })

        let row = element;
        row.style.position = 'relative';
        row.appendChild(borderEl);
    })
}