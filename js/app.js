//Global variables to handle API calls.
var coords;
var map;
var service;


//Add a marker to the map
function createMarker(data) 
{
    console.log(data);
    let marker = new google.maps.Marker(
        {
            position : data.geometry.location,
            map : map
        });

    marker.infoWindow = new google.maps.InfoWindow(
        {
            content : 
            `
            <h5>${data.name}</h5>
            <p>${data.formatted_address}</p>
            `
        });

    marker.addListener('click', function()
        {
            marker.infoWindow.open(map, marker);
        });

}


//Listen for detailed event request and display the individual event.
function displayEventDetail()
{

    $('#eventList').on('click', 'button', function(data)
    {
        console.log('event detail clicked');
    });
}


//Create the event list and append items to the DOC
function createEventDisplay(event)
{

    let eventHTML =
    `<li>
        <h4>${event.name.html}
        </h4>
        <img class="eventThumbnail" src="${event.logo.url}" alt="${event.name.html}">
        <a href="${event.url}">Visit the Event page on eventbrite.com</a><br>
        <button data-event-id="${event.id}" type="button" class="btn btn-link btn-md">Event Details</button>

    </li>
    `;

    $('#eventList').append(eventHTML);
 
}


//Search for events using Eventbrite API
function eventSearch(apiQuery)
{
    const EVENTBRITE_URL = 'https://www.eventbriteapi.com/v3/events/search/';
    
    let formattedStartDate = apiQuery.start + "T00:00:00";
    let formattedEndDate = apiQuery.end + "T23:59:59";

    let parameters = 
    {
        q : apiQuery.sport,
        'location.latitude' : coords.lat,
        'location.longitude' : coords.lng,
        'start_date.range_start' : formattedStartDate,
        'start_date.range_end' : formattedEndDate,
        token : 'EDV4JBTI3R6EUVDOU3PP'
    };

    ($.getJSON(EVENTBRITE_URL, parameters, function(data)
    {
    
        let events = data.events;

        events.forEach(event =>
        {
            createEventDisplay(event);
        });

        displayEventDetail();
    }));
    
}


//Search locations using google text search api
function searchPlaces(query)
{

   service = new google.maps.places.PlacesService(map);
   service.textSearch(query, processPlaces);
    
}


//Process the places results
function processPlaces(results, status) 
{
    if (status == google.maps.places.PlacesServiceStatus.OK) 
    {
      for (let i = 0; i < results.length; i++) 
      {
        let place = results[i];
        createMarker(place);
      }
    } else 
    {
        alert('Error searching for locations. Please try again.');
    }
}


//Geocode the location
function geocode(searchLocation)
{
   
    const API_KEY = 'AIzaSyC_LJ5t0klmo5LuUXUJ66U8Zv5eeQ2XevU';
    const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    let query = 
    {
        address : searchLocation,
        key : API_KEY 
    };

    $.ajax( GEOCODE_URL, 
        {
            async : false,
            data : query,
            success : function(data)
            {
                coords = {
                    lat : data.results[0].geometry.location.lat,
                    lng : data.results[0].geometry.location.lng
                }; 
            }
        }
           
    )
}


//Handle Map Initiliaztion
function initMap(mapOptions)
{
    $('#results').removeClass('hide');

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


//Main handler for API Calls
function handleAPIRequests(apiQuery)
{
    //Find the location the user entered
    geocode(apiQuery.location);
    
    let mapOptions  = {
        zoom: 10,
        center: coords
    };
    
    initMap(mapOptions);

    //Make Google Places API Call
   let options = [apiQuery.sport, 'restaurant']//, 'hotel', 'parking'];

    options.forEach(option => 
    {
        
        let request = 
        {
            query: option,
            location: coords,
            radius: '250'
        };

        searchPlaces(request);
      
    });
    

    //Make EventBrite API Call
    eventSearch(apiQuery);

}


//Listen for full form submission
function handleFormSubmission(sportsQuery)
{
    $('#searchForm').on('submit', function(event)
    {
        
        event.preventDefault();
        
        let $location = $('#searchArea').val() ;

        let $startDate = $('#startDate').val() ;

        let $endDate = $('#endDate').val();

        let apiQuery = 
        {
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

    $('#js_sport').on('change', function(event)
    {
        
        let $sportSelection = $('#js_sport option:selected');
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
