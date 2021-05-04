console.log(`WazirX API`);

const fetch = require('node-fetch');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

const API = `https://api.wazirx.com/api/v2/tickers`;

let settings = { method: "Get" };
  

const getWazirxApiData = async () => {

    while(true) {

        await sleep(500)

        //Fetch Data ...
        fetch(API, settings)
        .then(res => res.json())
        .then((data) => {

            //Get Data
            var dataKeys = Object.keys(data);
            var keys = [];

            for(var i=0; i<dataKeys.length; i++){
                
                if(dataKeys[i].toLowerCase().includes("dogeinr")){ //inr
                    keys.push(dataKeys[i]);
                }else if(dataKeys[i].toLowerCase().includes("bttinr")){ //inr
                    keys.push(dataKeys[i]);
                }else if(dataKeys[i].toLowerCase().includes("btcinr")){ //inr
                    keys.push(dataKeys[i]);
                }

            }

            var finalData = [];

            for(var i=0; i<keys.length; i++){

                var element = data[keys[i]];

                if(element.last !== '0.0'){
                    var obj = {
                        name: element.name,
                        open: element.open,
                        last: element.last
                    }
            
                    finalData.push(obj);
                }
            }

              console.clear();
            // console.log(`${new Date().toLocaleTimeString()}\n\n${JSON.stringify(finalData[0])}`);
            for(var i=0; i<finalData.length; i++){

                if(finalData[i].name.includes("DOGE/INR")){

                    getInfo(finalData[i], 18.029, 5, "Sourabh Nihore");
                    getInfo(finalData[i], 24.6523, 7, "Devesh Muradiya");
                    getInfo(finalData[i], 36.90, 27, "Devesh Muradiya");

                }else if(finalData[i].name.includes("BTT/INR")){
                    getInfo(finalData[i], 0.55745, 225, "Devesh Muradiya");
                }else if(finalData[i].name.includes("BTC/INR")){
                    getInfo(finalData[i], 4510000, 0.00002, "Devesh Muradiya");
                }
            }
            // console.log(finalData);
            

        });
    }
}

function getInfo(data, buyAt, quantity, userName){

    const time = new Date().toLocaleTimeString();
    
    var name = data.name;
    var last = Number(data.last);
    // var buyAt = 18.029;
    // var quantity = 5;

    var totalBuyAt = quantity * buyAt;
    var totalNow = quantity * last;

    var difference = last - buyAt;
    var profit_and_loss = totalNow - totalBuyAt;

    var profit_and_loss_per = (difference/buyAt)*100;

    console.log(`User Name: ${userName}`)

    console.log(`${time}\n\nName: ${name}\nBuy At: ${buyAt}\tTotalBuyAt: ${totalBuyAt.toFixed(2)}\tQuantity: ${quantity}`);

    console.log(`LTP: ${last}\tTotalNow: ${totalNow.toFixed(2)}`);

    console.log(`P&L: ${profit_and_loss.toFixed(2)}\t ROI: ${profit_and_loss_per.toFixed(2)}%`);
    console.log("\n##########\n");
}



async function get(){
    try{
    
        getWazirxApiData();
        
    }catch(err){}
}

get();