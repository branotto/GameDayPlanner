const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyC_LJ5t0klmo5LuUXUJ66U8Zv5eeQ2XevU';

var coords = {
    lat : 39.50,
    lng : -98.35
};

var map;

//Geocode the location
function geocode(searchLocation){
    let query = {
        address : searchLocation,
        key : API_KEY 
    };

    ($.getJSON(GEOCODE_URL, query, function(data){
	    
        coords = {
            lat : data.results[0].geometry.location.lat,
            lng : data.results[0].geometry.location.lng
        }

        let mapOptions  = {
            zoom: 10,
            center: coords
        };
        
        initMap(mapOptions);
    }));
}

//Handle Map Initiliaztion
function initMap(mapOptions) {
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//Main handler for API Calls
function handleAPIRequests(apiQuery)
{
    //Find the location the user entered
    geocode(apiQuery.location);

    //Make Google Places API Call
    //searchPlaces(coords)

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


(documentReady());
