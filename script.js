/*
user types a city in the search bar
city gets prepended below the search bar
api.openweathermap.org/data/2.5/forecast?lat=35&lon=139
call api with info and display the weather for today in the first row on the right  and the weather for the next five days below
*/
var key = "8b03830118ea1502c8d1ce9605fe6485";

$(document).ready(function(event){
    console.log("doc ready")
    $("#searchbtn").on("click", function(event){
        event.preventDefault();
        console.log("button pressed");
        var searchTxt = $("#searchbar").val();
        console.log(searchTxt);
        $("#searchbar").val("");
        $("#citylist").prepend(`
        <li class="list-group-item" style="width: 100%; margin-top: 10px;"> 
            ${searchTxt}
        </li>
        `);
        var currentWeatherJSON = currentWeatherAPICall(searchTxt);
    
        
    }) 
})

function currentWeatherAPICall(city){
    var queryURLCurentWeather = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=Imperial&appid=" + key;
    $.ajax({
        url: queryURLCurentWeather,
        method: "GET",
        success: function(uvresponse){
            console.log(uvresponse);
            UVAPICall(uvresponse.city.coord.lat,uvresponse.city.coord.lon);
        }
    }).then(function(resp){
        console.log("current weather api")
        var cityName = resp.city.name=== null ? "" : resp.city.name;
        dayZero(resp.list,cityName);
        var response = buildWeatherList(resp.list)
        $("#weatherfivedays").html("")
        for(var i = 0; i<5; i++){
            var idlist = ["weatherdayzero","weatherdayone","weatherdaytwo","weatherdaythree","weatherdayfour","weatherdayfive"];            
            var date = response[i].dt=== null ? "" : moment.unix(response[i].dt).format("MM-DD-YYYY"); 
            var weathersign = response[i].weather[0].main=== null ? "" : response[i].weather[0].main;
            var iconcode = response[i].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            var temperature = response[i].main.temp=== null ? "" : response[i].main.temp;
            var humidity = response[i].main.humidity=== null ? "" : response[i].main.humidity;
            var windSpeed = response[i].wind.speed=== null ? "" : response[i].wind.speed;
            $("#weatherfivedays").append(`
            <div class="card text--white bg-primary" style="max-width: 10rem;">
                <div class="card-body">
                    <h6 class="card-title">${date}</h6>
                    <div id="icon"><img id="wicon" src="${iconurl}" alt="Weather icon"></div>
                    <!--<p class="card-text">{weathersign}</p>-->
                    <p class="card-text">${"Temp: " + Math.round(temperature) + " " + String.fromCharCode(8457)}</p>
                    <p class="card-text">${"Humidity: "+humidity+"%"}</p>
                </div>
            </div>
            `)                
            
        }
        
    })
    
    
}

function UVAPICall(lat,lon){
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid=" + key;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log("uv api")
        var uvIndex = response.value;
        console.log(uvIndex)
        $("#uv").text("UV Index: "+uvIndex);
    })
}

function buildWeatherList(JSONList){
    var arr = [];
    var dayOne = moment().add(1, 'days').format("MM-DD-YYYY")
    var dayTwo = moment().add(2, 'days').format("MM-DD-YYYY")
    var dayThree = moment().add(3, 'days').format("MM-DD-YYYY")
    var dayFour = moment().add(4, 'days').format("MM-DD-YYYY")
    var dayFive = moment().add(5, 'days').format("MM-DD-YYYY")
    JSONList.forEach(obj => {
        var dateForcast = moment.unix(obj.dt).format("MM-DD-YYYY HH")
        
        
        if((dayOne + " 12") === dateForcast){
            console.log("inside buildWeather function in for loop")
            console.log(obj)
            arr.push(obj)
            
        }
        else if((dayTwo + " 12") === dateForcast){
            console.log("inside buildWeather function in for loop")
            console.log(obj)
            arr.push(obj)
        }
        else if((dayThree + " 12") === dateForcast){
            console.log("inside buildWeather function in for loop")
            console.log(obj)
            arr.push(obj)
        }
        else if((dayFour + " 12") === dateForcast){
            console.log("inside buildWeather function in for loop")
            console.log(obj)
            arr.push(obj)
        }
        else if((dayFive + " 12") === dateForcast){
            console.log("inside buildWeather function in for loop")
            console.log(obj)
            arr.push(obj)
        }

        
    });
    console.log(arr)
    return arr
}

function dayZero(JSONList,city){
    var date = JSONList[0].dt=== null ? "" : moment.unix(JSONList[0].dt).format("MM-DD-YYYY"); 
    var weathersign = JSONList[0].weather[0].main=== null ? "" : JSONList[0].weather[0].main;
    var iconcode = JSONList[0].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    var temperature = JSONList[0].main.temp=== null ? "" : JSONList[0].main.temp;
    var humidity = JSONList[0].main.humidity=== null ? "" : JSONList[0].main.humidity;
    var windSpeed = JSONList[0].wind.speed=== null ? "" : JSONList[0].wind.speed;
    $("#weathertoday").html(
        `<div class="card" style="border-style: none;">
            <div class="card-body">
                <h2 class="card-title" id="cityname">${city + "("+date+") "}<img id="wicon" src="${iconurl}" alt="Weather icon"></h2>
                <p class="card-text" id="temp">${"Temperature: "+Math.round(temperature)+" "+String.fromCharCode(8457)}</p>
                <p class="card-text" id="humidity">${"Humidity: "+humidity+" %"}</p>
                <p class="card-text" id="wind">${"Wind Speed: "+Math.round(windSpeed)+" MPH"}</p>
                <p class="card-text" id="uv"></p>
            </div>
        </div>
       `)                      
}