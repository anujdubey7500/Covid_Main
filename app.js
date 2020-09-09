const express = require("express");
const app = express();
const https=require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(request , response){

    response.sendFile(__dirname + "/index.html");

});

app.post("/", function(request , response){
    
    var st1=request.body.nameState;
    var cit1 = request.body.cityName;
    var n1=st1.toLowerCase();
    var n2=cit1.toLowerCase();
    const nameOfState = st1.charAt(0).toUpperCase()+st1.substring(1,st1.length);
    const nameOfCity = cit1.charAt(0).toUpperCase()+cit1.substring(1,cit1.length);
             
    const url="https://api.covidindiatracker.com/state_data.json";

    https.get(url,function(res){

        console.log(res.statusCode);
        var stateName=nameOfState;
        var districtName=nameOfCity;
            let body = [];
                      // Read the data
                      res.on('data', data => {
                        body += data.toString();

                      });

                      res.on('end', () => {
                      // Parse the data
                      const covid=JSON.parse(body);
                      var index = covid.findIndex(obj => obj.state==stateName);
                
                     var index1 = covid[index].districtData.findIndex(obj => obj.name==districtName);
                     const namest = covid[index].state;
                     const activeCasesInState = covid[index].active;
                     const confirmedCasesInState = covid[index].confirmed;  
                     const recoveredCasesInState = covid[index].recovered;
                     const deathsCasesInState = covid[index].deaths;

                     const cityNa = covid[index].districtData[index1].name;        
                     const confirmedCasesInCity = covid[index].districtData[index1].confirmed;  
                     
                   //console.log(covid[index].districtData[index1].confirmed);
                
                   //response.write("<h1>The confirmed cases  is " + covid[index].confirmed +  "</h1>")

                   response.write(
                    "<html><title>Results</title><head><style>h1{color:green;}  div{background-color:lightblue; text-align:center;}</style></head><body>  <div class=one> <h1>State: "+ namest +" </h1><h2>Confirmed Cases:"+ confirmedCasesInState +" </h2><h2>Active Cases: "+ activeCasesInState+"</h2><h2>Recovered Cases: "+ recoveredCasesInState+"</h2><h2>Death Cases: "+deathsCasesInState+"</h2></div><div> <h1>City: "+cityNa+"</h1><h2>Confirmed Cases: "+confirmedCasesInCity+"</h2></div>  <body></html>"
                   );

                
                   response.send();
                     
                      });
        })
        
    })
   



app.listen(process.env.PORT || 3000, function(){

    console.log("Server is running on port 3000");
});