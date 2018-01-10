//Array for the topics/buttons and initialization of variables
var topics = ["Princess Leia", "Yoda", "Darth Vader", "Luke Skywalker", "Han Solo", "Chewbacca", "Kylo Ren", "R2D2", "Stormtrooper", "BB8"];
var results;
var imgAnimate;
var imgStill;
var state;
var stills = [];
var animates = [];
//function that creates buttons from the topics in array
function createButtons() {
    $("#buttons_view").empty();
    //goes through every item in the array and creates a button for each
    for (var i = 0; i < topics.length; i++) {
        var button = $("<button>");
        button.addClass("topic btn btn-primary btn-lg");
        button.attr("data-name", topics[i]);
        button.text(topics[i].toUpperCase());
        $("#buttons_view").append(button);
    }
}
//on click function for when a user submits input
$("#add_gif_search").on("click", function(event) {
    event.preventDefault();
    //the input is then added to the topics array and we run the button function
    var topic = $("#search_input").val().trim();
    topics.push(topic);
    createButtons();
});
//this function will take the data-name attribute of each button clicked, run it through the API, and display GIFs for user
function displayGifs() {
    $("#gifs_view").empty();
    var topic = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=rj4DPXQLaQeJygm3ZVSIFq1rcwyM5QIV&limit=10";
    //ajax call, will use the queryURL provided and populate GIFs accordingly - limited at 10
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        results = response.data;
        //here we take both the still images and the gif (animated) images and save the url values to later be used in our animation function
        for (var i = 0; i < results.length; i++) {
            imgStill = results[i].images.original_still.url;
            stills.push(imgStill);
            imgAnimate = results[i].images.original.url;
            animates.push(imgAnimate);

            // Creating and storing a div tag
            var gifDiv = $("<div>");

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("RATED: " + results[i].rating.toUpperCase());

            var gifImage = $("<img height='250' width='350' data-state='still'>");
            // state = gifImage.attr("data-state");
            gifImage.addClass("gif");
            gifImage.attr("src", imgStill);
            gifDiv.addClass("gifImageDiv");
            gifDiv.append(p);
            gifDiv.append(gifImage);

            $("#gifs_view").append(gifDiv);
        }
    });
}
//this function will switch images from static to animate and vice versa per click
function animateImg() {
    var index;
    //we get the data-state attribute from the image clicked
    state = this.getAttribute('data-state');
    //if image is at still state...url and state are changed to match animated
    if (state === "still") {
        index = stills.indexOf($(this).attr("src"));
        $(this).attr("src", animates[index]);
        $(this).attr("data-state", "animate");
        //otherwise, the image is animated and needs to be switched to still...url and state are changed to match still
    } else {
        index = animates.indexOf($(this).attr("src"));
        $(this).attr("src", stills[index]);
        $(this).attr("data-state", "still");
    }
}
//on click functions that target dynamically created elements
//the first one takes the topic class and runs the displayGifs function - this will display all the gifs to the page
//the second one takes the gif class and runs the animateImg function - which starts/stops the gif image animation
$(document).on("click", ".topic", displayGifs);
$(document).on("click", ".gif", animateImg);
//createButtons function is called to create all buttons based off items in array
createButtons();