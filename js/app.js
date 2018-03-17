



function initMap(mapOptions) {
    
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//Main handler for API Calls
function handleAPIRequests(apiQuery)
{

    console.log(apiQuery);

    let mapOptions = {
        zoom: 4,
        center: {
            lat : 39.2904,
            lng : -76.6122
        }
    };

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