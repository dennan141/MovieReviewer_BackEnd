using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using MovieReviewer.Data;
using Microsoft.EntityFrameworkCore;
using MovieReviewer.Config;

var application = new MovieReviewerApplication(args);

application.Run();
