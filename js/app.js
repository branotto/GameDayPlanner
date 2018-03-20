var coords = {
    lat : 39.50,
    lng : -98.35
};

var map;

function createMarker(data) {
    console.log(data);
}

function searchPlaces(results, status) {
    /*if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          let place = results[i];
          createMarker(results[i]);
        }
      }*/

      console.log('Searching places.' );
      //console.log(results);
}

//Geocode the location
function geocode(searchLocation){
   
    const API_KEY = 'AIzaSyC_LJ5t0klmo5LuUXUJ66U8Zv5eeQ2XevU';
    const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

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
    $('#results').removeClass('hide');

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//Main handler for API Calls
function handleAPIRequests(apiQuery)
{
    //Find the location the user entered
    geocode(apiQuery.location);

    //Make Google Places API Call
   /* let options = ['restaurant', 'hotel', 'parking'];

    options.forEach(option => {
        
        let request = {
            location: coords,
            radius: '500',
            query: option
          };

        console.log(request);

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, searchPlaces);
      
    });*/
    

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
function handleSelections()
{

    let $sportSelection = $('#js_sport option:selected');

    $('#js_sport').on('change', function(event){
        
        let sportsQuery= $sportSelection.text();   

        $("option[value='select']").attr("disabled", "disabled");

        handleFormSubmission(sportsQuery);
    }); 
}


//Document Ready Function
function documentReady()
{
    handleSelections();  
}


(documentReady());
