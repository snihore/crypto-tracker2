const express = require('express');
const fetch = require('node-fetch');

const {inputData} = require('./input');

const API = `https://api.wazirx.com/api/v2/tickers`;

let settings = { method: "Get" };

const app = express();
const PORT = 3000;

function getInfo(data, buyAt, quantity, userName){

    const time = new Date().toLocaleTimeString();
    
    var name = data.name;
    var last = Number(data.last);

    var totalBuyAt = quantity * buyAt;
    var totalNow = quantity * last;

    var difference = last - buyAt;
    var profit_and_loss = totalNow - totalBuyAt;

    var profit_and_loss_per = (difference/buyAt)*100;

    var obj = {
        userName,
        time,
        name,
        buyAt,
        totalBuyAt: totalBuyAt.toFixed(2),
        quantity,
        last,
        totalNow: totalNow.toFixed(2),
        profit_and_loss: profit_and_loss.toFixed(2),
        profit_and_loss_per: profit_and_loss_per.toFixed(2)
      };
    
      return obj;
}


const getWazirxApiData = (res) => {

     //Fetch Data ...
     fetch(API, settings)
     .then(res => res.json())
     .then((data) => {

         //Get Data
         var dataKeys = Object.keys(data);
         var keys = [];
         var types = new Set();
         var smallTypes = new Set();

         for(var i=0; i<inputData.length; i++){
             var type = inputData[i].type;
             var smallType = inputData[i].smallType;

             types.add(type);
             smallTypes.add(smallType);
         }

         for(var i=0; i<dataKeys.length; i++){

            smallTypes.forEach(smallType => {
                if(dataKeys[i].toLowerCase().includes(smallType)){ //inr
                    keys.push(dataKeys[i]);
                }
            });

             
            //  if(dataKeys[i].toLowerCase().includes("dogeinr")){ //inr
            //      keys.push(dataKeys[i]);
            //  }else if(dataKeys[i].toLowerCase().includes("bttinr")){ //inr
            //      keys.push(dataKeys[i]);
            //  }else if(dataKeys[i].toLowerCase().includes("btcinr")){ //inr
            //      keys.push(dataKeys[i]);
            //  }

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

         var arr = [];



         for(var j=0; j<inputData.length; j++){

            var type = inputData[j].type;

            for(var i=0; i<finalData.length; i++){

                types.forEach(t => {

                    if(finalData[i].name.includes(t) && finalData[i].name.includes(type)){

                        arr.push(getInfo(finalData[i], inputData[j].buyAt, inputData[j].quantity, inputData[j].name));
    
                    }
                    
                });

                // if(finalData[i].name.includes("DOGE/INR") && finalData[i].name.includes(type)){

                //     arr.push(getInfo(finalData[i], inputData[j].buyAt, inputData[j].quantity, inputData[j].name));

                // }else if(finalData[i].name.includes("BTC/INR") && finalData[i].name.includes(type)){

                //     arr.push(getInfo(finalData[i], inputData[j].buyAt, inputData[j].quantity, inputData[j].name));

                // }else if(finalData[i].name.includes("BTT/INR") && finalData[i].name.includes(type)){

                //     arr.push(getInfo(finalData[i], inputData[j].buyAt, inputData[j].quantity, inputData[j].name));

                // }
            }
         }

        //  console.log(arr);
         
         res.send(arr); 

     });
}

app.get('/', (req, res) => {

    try{
        getWazirxApiData(res);
    }catch(err){
        res.send({ error: err.message });
    }
    
});

app.listen(PORT, () => {
    console.log(`server is listen on port ${PORT}`);
});