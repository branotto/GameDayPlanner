









//Main handler for API Calls
function handleAPIRequests(searchTerm)
{
    //Make Google Maps API Call


    //Make EventBrite API Call


    //Make FourSquare API Call


}


//Listen for Form submission
function handleSearch()
{
    
    $('#searchForm').on('submit', function(event){
        let $searchQuery = $('#searchText').val();    
        event.preventDefault();
        
        handleAPIRequests($searchQuery);

    });
}


//Document Ready Function
function handleCallBack()
{
    
    handleSearch();
}



$(handleCallBack)