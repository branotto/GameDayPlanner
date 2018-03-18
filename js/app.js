const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyC_LJ5t0klmo5LuUXUJ66U8Zv5eeQ2XevU';

//Geocode the location
function geocode(searchLocation){
    let query = {
        address : searchLocation,
        key : API_KEY 
    };

    let coords;
    $.ajax({
        url: `${GEOCODE_URL}?address=${query.searchLocation}&key=${query.key}`,
        async: false,
        dataType: 'json',
        success: function (response) {
            coords = response.results[0].geometry.location;;
          }
    });

    return coords;
    
}

//Handle Map Initiliaztion
function initMap(mapOptions) {
    console.log('mapoptions at init call' + mapOptions);
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//Main handler for API Calls
function handleAPIRequests(apiQuery)
{

    let mapOptions  = {
        zoom: 4,
        center: {
            lat : 39.50,
            lng : -98.35
        }
    };

    console.log('mapoptions before' + mapOptions);
    if(apiQuery.location !== "")
    {
        mapOptions.center = geocode(apiQuery.location);
    }


    //Make Google Maps API Call
    initMap(mapOptions);

    //Make EventBrite API Call


    //Make FourSquare API Call


}


//Listen for full form submission
function handleFormSubmission(sportsQuery)
{
    $('#searchForm').on('submit', function(event){
        
        event.preventDefault();
        
        let $location = $('#searchArea').val() ;

        let $startDate = $('#startDate').val() ;

        let $endDate = $('#endDate').val();

        let apiQuery = {
            sport : sportsQuery,
            location : $location,
            start : $startDate,
            end : $endDate
        };

    handleAPIRequests(apiQuery);

    });
}


//Listen for Sport Selection
function handleSportSelection()
{
    
    $('#js_sport').on('change', function(event){
        let $sportSelection = $('#js_sport option:selected')
        let sportQuery = $sportSelection.text();   

        $("option[value='select']").attr("disabled", "disabled")

        handleFormSubmission(sportQuery);

    });
}


//Document Ready Function
function documentReady()
{
    handleSportSelection();  
}


$(documentReady)