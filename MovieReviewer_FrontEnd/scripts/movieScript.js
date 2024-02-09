const API_MAIN_URL = "https://localhost:7199/";
const ALL_MOVIES_URL = API_MAIN_URL + "api/movies";

document.addEventListener("DOMContentLoaded", function (event) {

    //Load all elements
    const GetAllMoviesButton = document.getElementById("GetAllMoviesButton");
    const getMovieFromIdButton = document.getElementById("getMovieBtn");
    const DeleteMovieFromIdButton = document.getElementById("deleteMovieBtn");
    const divElementForList = document.getElementById("MovieOutput");
    const addMovieForm = document.getElementById("addMovieForm");
    const updateMovieForm = document.getElementById("updateMovieForm")


    //Add eventlisteners
    GetAllMoviesButton.addEventListener("click", GetAllMoviesFromAPI);

    getMovieFromIdButton.addEventListener("click", function (event) {
        event.preventDefault();
        let movieId = document.getElementById("movieId").value;
        GetMovieFromId(movieId);
    })

    DeleteMovieFromIdButton.addEventListener("click", (eevent) => {
        event.preventDefault();
        let movieId = document.getElementById("deleteMovieId").value;
        DeleteMovieFromId(movieId);
    })

    addMovieForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let year = document.getElementById("formYear").value;
        let title = document.getElementById("createFormTitle").value;
        console.log(title)
        AddMovie(title, year)
    })

    updateMovieForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let id = document.getElementById("formId").value;
        let title = document.getElementById("formTitle").value;
        let year = document.getElementById("updateFormYear").value;

        updateMovie(id, title, year);

    })


    // --- MOVIES ---
    //GET all movies
    async function GetAllMoviesFromAPI() {
        const response = await fetch(ALL_MOVIES_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                populateList(response)
            })
            .catch(error => console.log("Error fethcing all movies: " + error));
    }

    //GET specific movie
    async function GetMovieFromId(id) {
        try {
            const response = await fetch(ALL_MOVIES_URL + "/" + id, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            //IF success do this else display errors
            if (response.ok) {
                const data = await response.json();
                singleMovieDisplay(data);
            } else DisplayError(response.status)

        } catch (error) {
            console.log("Error! : " + error);
        }
    }

    

    //DELETE movie
    async function DeleteMovieFromId(id) {
        try {
            const response = await fetch(ALL_MOVIES_URL + "/" + id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                }
            })
            if (response.ok) {
                GetAllMoviesFromAPI();
            } else {
                DisplayError(response.status)
            }

        } catch (error) {
            console.log("Error! : " + error);
        }
    }

    //ADD movie
    async function AddMovie(title, releaseYear) {
        const requestBody = JSON.stringify({
            "title": title,
            "releaseYear": releaseYear
        })
        try {
            const response = await fetch(ALL_MOVIES_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: requestBody
            })
            if (response.ok) {
                const data = await response.json();
                singleMovieDisplay(data);
            } else DisplayError(response.status)

        } catch (error) {
            console.log("Error! : " + error);
        }
    }

    //UPDATE movie
    async function updateMovie(movieId, title, year) {
        const requestBody = JSON.stringify({
            "id": movieId,
            "title": title,
            "releaseYear": year
        })
        try {
            const response = await fetch(ALL_MOVIES_URL + "/" + movieId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: requestBody
            })

            if (response.ok) {
                GetAllMoviesFromAPI();
            }
            else DisplayError(response.status)


        } catch (error) {
            console.log("Error! : " + error);
        }
    }



    // ------------ PRIVATE FUNCTIONS --------------
    //Receives a movie list and generates a list item for each title.
    function populateList(movieList) {
        //This line clears the list first.
        divElementForList.innerHTML = "";

        //Loop through an append a movie title
        movieList.forEach(element => {
            var listItem = document.createElement("li");
            let infoToDisplay = element.title + " ( Id: " + element.id + ")"

            listItem.innerHTML = infoToDisplay;

            divElementForList.appendChild(listItem)
        });
    }


    //TODO: Display everything for a single movie
    function singleMovieDisplay(movie) {
        //This line clears the list first.
        divElementForList.innerHTML = "";

        //Creates elements
        var listItem = document.createElement("li")
        var nestedList = document.createElement("ul");
        var titleListElement = document.createElement("li")
        var yearListElement = document.createElement("li");
        var reviewListElement = document.createElement("li");

        //Populating year and, id and comment
        listItem.innerHTML = "Movie ID: " + movie.id;
        titleListElement.innerHTML = "Title: " + movie.title;
        yearListElement.innerHTML = "Release year: " + movie.releaseYear

        //Showing title and release year
        listItem.appendChild(titleListElement);
        listItem.appendChild(yearListElement);

        //Looping through the reviews and adding them to nested list
        if (movie.reviews.length >= 1) {
            movie.reviews.forEach(review => {
                //Creating item and list for appending
                let reviewItem = document.createElement("li");
                let reviewNestedList = document.createElement("ul");

                //Creating Score and Comment
                let reviewCommentElement = document.createElement("li");
                let reviewScoreElement = document.createElement("li");

                //Populating Score and Comment
                reviewCommentElement.innerHTML = "Comment: " + review.comment;
                reviewScoreElement.innerHTML = "Score: " + review.score;

                //Adding Score and Comment to nested list
                reviewNestedList.appendChild(reviewCommentElement);
                reviewNestedList.appendChild(reviewScoreElement);

                //Adding nested list to list item with id
                reviewItem.innerHTML = "Review ID: " + review.id;
                reviewItem.appendChild(reviewNestedList);

                //Adding completed review to outside nested list of reviews
                nestedList.appendChild(reviewItem);
                listItem.appendChild(nestedList)
            });
        } else {
            reviewListElement.innerHTML = "No reviews"
        }

        //Adds the items for movie and possible reviews

        listItem.appendChild(reviewListElement)

        divElementForList.appendChild(listItem);
    }


    function DisplayError(responseStatus) {
        divElementForList.innerHTML = "";

        var listItem = document.createElement("li")
        var errorMessage = "";

        //Lists common mistakes and adds them to error messages
        if(responseStatus == 404){
            errorMessage = "Object not found!"
        }else if(responseStatus == 401){
            errorMessage = "Unauthorized! Try logging in! "
        }else if(responseStatus == 403){
            errorMessage = "Forbidden! What are you doing?"
        }else if(responseStatus == 400){
            errorMessage = "Bad request! try filling the data in correctly, not incorrectly!"
        }
        
        let infoToDisplay = "Something went wrong: " + responseStatus + " " + errorMessage
        listItem.innerHTML = infoToDisplay;

        divElementForList.appendChild(listItem);

    }

});