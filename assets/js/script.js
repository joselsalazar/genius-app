	// Chosen CSS
    var config = {
      '.chosen-select'           : {},
      '.chosen-select-deselect'  : {allow_single_deselect:true},
      '.chosen-select-no-single' : {disable_search_threshold:10},
      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
      '.chosen-select-width'     : {width:"95%"}
    }
    for (var selector in config) {
      $(selector).chosen(config[selector]);
    }

    // Capture the form inputs 
    $("#submit").on("click", function(){

    	// Form validation
    	function validateForm() {
		  var isValid = true;
		  $('.form-control').each(function() {
		    if ( $(this).val() === '' )
		        isValid = false;
		  });

		  $('.chosen-select').each(function() {

		  	if( $(this).val() === "")
		  		isValid = false
		  })
		  return isValid;
		}

		// If all required fields are filled
		if (validateForm() == true)
		{
			// Create an object for the user's data
			var score = [];
			for (var i = 1; i <= 10; i++) {
				var scoresel = $("#q" + i).val();
				score.push(parseInt(scoresel));
			}

			var scoreSum = score.reduce((a, b) => a + b, 0);

			console.log(`This is the scoreSum: ${scoreSum}`);

	    	var userData = {
	    		friendsName: $("#name").val(),
	    		friendsPic: $("#photo").val(),
	    		totalScore: scoreSum
	    	}

	    	// Grab the URL of the website
	    	var currentURL = window.location.origin;

	    	$.ajax({ url: currentURL + "/api/friendsList", method: "GET"})
	    	.done(function(friendsData) {
	    		var message;
	    		var matches = [];
	    		var matchesValues = [];
	    		var pos = 0;
	 
	    		var getMatch = () => {
		    		for (var i = 0; i < friendsData.length; i++) {
		    				let matchTotalScore = parseInt(friendsData[i].totalScore); 
		    				matches.push(friendsData[i]);
		    				matchesValues.push(matchTotalScore);
		    			}

		    		bestMatch(scoreSum, matchesValues);
	    		};

	    		var bestMatch = (num, arr) => {
	    			var low = arr[0];
	    			var difference = Math.abs(num - low);

	    			for (var i = 0; i < arr.length; i++) {
	    				var newDifference = Math.abs(num - arr[i]);
	    				if(newDifference < difference) {
	    					difference = newDifference;
	    					low = arr[i];
	    					pos = i;
	    				}
	    			}
	    			return pos;
	    		}

	    		getMatch(bestMatch);

	    		console.log(`Your best match is ${matches[pos].friendsName}`);
	    		
	    		$("#matchName").html(matches[pos].friendsName);
	    		$('#matchImg').attr("src", friendsData[pos].friendsPic);
	    		// Show the modal with the best match 
		    	$("#resultsModal").modal('toggle');
		    	postAJAX();
	    	});

	    	// AJAX post the data to the friends API. 
	    	function postAJAX() {
		    	$.post(currentURL + "/api/friendsList", userData, function(data){
		    		console.log("This Ran!");
		    	});
	    	}
		}
		else
		{
			alert("Please fill out all fields before submitting!");
		}
    	
    	return false;
    });