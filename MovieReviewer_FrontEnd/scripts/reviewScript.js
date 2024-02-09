const API_MAIN_URL = "https://localhost:7199/";
const API_REVIEW_URL = API_MAIN_URL + "api/Reviews"

document.addEventListener("DOMContentLoaded", function (event) {

    //--------- GETTING HTML ELEMENTS ------------
    //Div to display information to user
    const output = document.getElementById("ReviewOutput");
    //Buttons
    const GetAllReviewsButton = document.getElementById("GetAllReviewsButton");
    const GetSpecificReviewButton = document.getElementById("getReviewBtn");
    const DeleteReviewButton = document.getElementById("deleteReviewBtn");
    //Forms
    const AddReviewForm = document.getElementById("addReviewForm")
    const UpdateReviewForm = document.getElementById("updateReviewForm");


    //------ EVENT LISTENERS ------------
    //Get all reviews
    GetAllReviewsButton.addEventListener("click", (event) => {
        event.preventDefault();
        GetAllReviews();

    });

    //Get review from id
    GetSpecificReviewButton.addEventListener("click", (event) => {
        event.preventDefault();
        var movieId = document.getElementById("reviewId").value;
        GetSpecificReview(movieId)
    })

    //Delete review
    DeleteReviewButton.addEventListener("click", (event) => {
        event.preventDefault();
        let reviewId = document.getElementById("deleteReviewId").value;
        DeleteReviewFromId(reviewId)
    })

    //Add review
    AddReviewForm.addEventListener("submit", (event) => {
        event.preventDefault();
        var comment = document.getElementById("createFormComment");
        var score = document.getElementById("createFormScore");
        var movieId = document.getElementById("createFormMovie");

        AddReview(comment, score, movieId);
    })

    UpdateReviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        var reviewId = document.getElementById("updateReviewId").value;
        var comment = document.getElementById("updateCommentId").value;
        var score = document.getElementById("updateScore").value;

        const result = await UpdateReview(reviewId, comment, score)
        DisplayError(result)
    })


    // ----------- FETCH FUNCTIONS ---------

    //GET all reviews
    async function GetAllReviews() {
        try {
            const response = await fetch(API_REVIEW_URL, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status != 200) {
                console.log("error getting all reviews: " + response.status)
            }

            const data = await response.json();

            DisplayListInfo(data);
        } catch (error) {

        }
    }

    //GET specific review from ID
    async function GetSpecificReview(id) {

        try {
            const response = await fetch(API_REVIEW_URL + "/" + id, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json'
                }
            })

            //ERROR HANDLING
            if (response.status != 200) {
                console.log("Error: " + response.status)
            }

            //SUCCESS
            const data = await response.json();
            DisplaySingleReviewInfo(data)

        } catch (error) {
            console.log("Error getting that review: " + error)
        }
    }

    //DELETE review from ID
    async function DeleteReviewFromId(id) {

        try {
            const response = await fetch(API_REVIEW_URL + "/" + id, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                }
            })

            //ERROR HANDLING
            if (response.status != 204) {
                console.log("Error deleting: " + response.status + response.statusText)
            }

            GetAllReviews();

            //MORE ERROR HANDLING
        } catch (error) {

        }
    }

    //ADD review
    async function AddReview(comment, score, movieId) {
        //Request body
        const requestBody = JSON.stringify({
            comment: comment.value,
            score: score.value,
            movieId: movieId.value,
            userId: localStorage.getItem("userToken")
        });

        try {
            const response = await fetch(API_REVIEW_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: requestBody
            });

            //ERROR HANDLING
            if (response.status != 201) {
                // Review added successfully
                console.log("Error adding review: " + response.status);
            }

            //SUCCESS
            GetAllReviews();

            //ERROR HANDLING AGAIN
        } catch (error) {
            console.log("Error adding review: " + error);
        }
    }

    async function UpdateReview(reviewId, comment, score) {
        const requestBody = JSON.stringify({
            "id": reviewId,
            "comment": comment,
            "score": score,
            "userId": localStorage.getItem("userToken")
        });

        try {
            const response = await fetch(API_REVIEW_URL + "/" + reviewId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                },
                body: requestBody
            });

            if (response.ok) {
                // Success
                if (response.status === 204) {
                    GetAllReviews();
                }
            } else {
                // Handle error response
                DisplayError(response.status, response.statusText);
            }

        } catch (error) {
            // Handle network errors or other exceptions
            console.error("Error updating review:", error);
            DisplayError("Network Error", "There was a problem updating the review.");
        }
    }



    // ------  PRIVATE FUNCTIONS --------
    //Loops thorugh each review and displays comments, score and movieId
    //In nested lists. 
    function DisplayListInfo(reviewList) {

        //This line clears the list first.
        output.innerHTML = "";

        //Loop through an append a movie title
        reviewList.forEach(review => {

            var listItem = document.createElement("li");
            var nestedList = document.createElement("ul");
            var listComment = document.createElement("li")
            var listScore = document.createElement("li")
            var movieId = document.createElement("li");


            listItem.innerHTML = "Review ID: " + review.id
            listComment.innerHTML = "Comment: " + review.comment;
            listScore.innerHTML = "Score: " + review.score;
            movieId.innerHTML = "Movie id: " + review.movieId;

            //Adds info to nested list and appends it to a li.
            nestedList.appendChild(listComment);
            nestedList.appendChild(listScore);
            nestedList.appendChild(movieId)

            listItem.appendChild(nestedList)

            output.appendChild(listItem)
        });

    }


    function DisplaySingleReviewInfo(review) {
        output.innerHTML = "";
        //Creates elements
        var listItem = document.createElement("li");
        var nestedList = document.createElement("ul");
        var listComment = document.createElement("li")
        var listScore = document.createElement("li")
        var movieId = document.createElement("li");

        //Gives correct data
        listItem.innerHTML = "Review ID: " + review.id
        listComment.innerHTML = "Comment: " + review.comment;
        listScore.innerHTML = "Score: " + review.score;
        movieId.innerHTML = "Movie id: " + review.movieId;

        //Adds info to nested list and appends it to a li.
        nestedList.appendChild(listComment);
        nestedList.appendChild(listScore);
        nestedList.appendChild(movieId)

        listItem.appendChild(nestedList)

        //Adds the data to the output in a list
        output.appendChild(listItem)
    }

    function DisplayError(statusText) {
        output.innerHTML = "";

        var listItem = document.createElement("li")
        listItem.innerText = "ERROR: " + statusText

        output.appendChild(listItem)
    }



});
