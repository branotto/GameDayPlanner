//Global variables to handle API calls.
var coords;
var map;
var service;
var infowindow = new google.maps.InfoWindow();


//Add a marker to the map
function createMarker(data, image) 
{
    let marker = new google.maps.Marker(
        {
            position : data.geometry.location,
            map : map
        });

    let content =  
        `
        <h3>${data.name}</h3>
        <p>${data.formatted_address}</p>
        `;

    bindInfoWindow(marker, map, infowindow, content, data);   
}


//Bind the shared info window
function bindInfoWindow(marker, map, infowindow, html, location) 
{
    marker.addListener('click', function() 
    {
        
        infowindow.setContent(html);
        infowindow.open(map, this);
        queryMapDetail(location);
    });
} 


//show the selected map location details
function queryMapDetail(location)
{

    $('#eventDetail').addClass('hide');
    $('#eventList').addClass('hide');
    $('#mapDetail').removeClass('hide');

 
    service.getDetails({ placeId: location.place_id}, function(place, status) 
    {
        console.log(place);
        if (status === google.maps.places.PlacesServiceStatus.OK)
        {

            let photoOptions = {
                maxHeight : 200,
                maxWidth: 200
            };
            
            let placePhoto = place.photos[0];

            let img_source = placePhoto.getUrl(photoOptions);

            let placeHTML =
            `<div class="placeDetail">
                <button type="button" class="btn btn-dark btn-md">Close</button>
                <h3 class="detailHeading" >${place.name}
                </h3>
                <img class="mapThumbnail img-fluid" src="${img_source}" alt="${place.name}">
                <a href="${place.website}">Visit the website.</a><br>
                ${place.adr_address}
            </div>
            `;
            
            $('#mapDetail').html(placeHTML);
        }

        returnToEvents();
    });  

}


//Close the map detail and display the event list
function returnToEvents()
{
    $('#mapDetail').on('click', 'button', function(data)
    {
        $('#mapDetail').html("").addClass('hide');

        $('#eventList').removeClass('hide');
    });
}


//Listen for detailed event request and display the individual event.
function displayEventDetail()
{

    $('#eventList').on('click', 'button', function(data)
    {
        let eventID = $(this).attr('data-event-id');

        detailEventQuery(eventID);

    });
}


//Listen for click to return to the eventlist.
function returnToEventList()
{

    $('#eventDetail').on('click', 'button', function(data)
    {
        $('#eventDetail').html("").addClass('hide');

        $('#eventList').removeClass('hide');
    
        displayEventDetail();

    });
   
}


//Display a single event
function displaySingleEvent(eventDetail)
{
    $('#eventList').addClass('hide');

    $('#eventDetail').removeClass('hide');


    let eventHTML =
    `<div class="event_detail">
        <button type="button" class="btn btn-dark btn-md">Back to Event List</button>
        <h3 class="detailHeading" >${eventDetail.name.html}
        </h3>
        <img class="eventThumbnail img-fluid" src="${eventDetail.logo.url}" alt="${eventDetail.name.html}">
        <a href="${eventDetail.url}">Visit the Event page on eventbrite.com</a><br>
        ${eventDetail.description.html}
    </div>
    `;

    $('#eventDetail').html(eventHTML);

    returnToEventList();
}


//Search for a specific event using Eventbrite API
function detailEventQuery(eventID)
{
    const EVENTBRITE_DETAIL_URL = 'https://www.eventbriteapi.com/v3/events/';

    let parameters = 
    {
        token : 'EDV4JBTI3R6EUVDOU3PP'
    };
    
    ($.getJSON(EVENTBRITE_DETAIL_URL + eventID + "/", parameters, function(data)
    {
        let eventDetail = data;

        displaySingleEvent(eventDetail);
        
    }));
    
}


//Create the event list and append items to the DOC
function createEventDisplay(event)
{
    
    let eventHTML =
    `<li>
        <h3 class="detailHeading" >${event.name.html}
        </h3>
        <img class="eventThumbnail img-fluid" src="${event.logo.url}" alt="${event.name.html}">
        <a href="${event.url}">Visit the Event page on eventbrite.com</a><br>
        <button data-event-id="${event.id}" type="button" class="btn btn-dark btn-md">Event Details</button>

    </li>
    `;

    $('#events').append(eventHTML);
 
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

        $('#events').html("");

        $('.js-event-count').html(`${events.length}`);

        if( events.length === 0 )
        {
            let noEvents = 
            `<li>
                <h3 class="detailHeading" >Please try a different search.
                </h3>
            </li>`;

            $('#events').html(noEvents); 

        } else
        {
            events.forEach(event =>
                {
                    createEventDisplay(event);
                });

            displayEventDetail();
        }
        
    }));
    
}


//Search locations using google text search api
function searchPlaces(query)
{

   service = new google.maps.places.PlacesService(map);
   service.textSearch(query, processPlaces);
    
}


//Callback function to process the places results
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
                coords = 
                {
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
        zoom: 14,
        center: coords
    };
    
    //Initialize the map
    initMap(mapOptions);

    //Set the options for the google places textsearch api.
   let options = [apiQuery.sport];

   if(apiQuery.extraQuery.restaurants)
   {
       options.push('restaurant');
   }

   if(apiQuery.extraQuery.parking)
   {
       options.push('parking');
   }

   if(apiQuery.extraQuery.hotel)
   {
       options.push('hotel');
   }

    options.forEach(option => 
    {
        
        let request = 
        {
            query: option,
            location: coords,
            radius: '250'
        };

        //Make google textsearch api call
        searchPlaces(request);
      
    });
    
    //Make EventBrite API Call
    eventSearch(apiQuery);

}


//Listen for Form Submission Selection
function handleSelections()
{
   
    $('#searchForm').on('submit', function(event)
    {
        event.preventDefault();

        let sportsQuery = $('#js_sport option:selected').text();   

        $("option[value='select']").attr("disabled", "disabled");
        
        let $location = $('#searchArea').val() ;

        let $startDate = $('#startDate').val() ;

        let $endDate = $('#endDate').val();

        let extras = {};

        extras.restaurants = $('#restaurant').is(':checked');
        extras.parking = $('#parking').is(':checked');
        extras.hotel = $('#hotel').is(':checked');

        let apiQuery = 
        {
            sport : sportsQuery,
            extraQuery : extras,
            location : $location,
            start : $startDate,
            end : $endDate
        };

    handleAPIRequests(apiQuery);

    });

}


(handleSelections());  
