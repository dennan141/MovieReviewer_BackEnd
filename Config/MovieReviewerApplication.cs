using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MovieReviewer.Data;
using MovieReviewer.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace MovieReviewer.Config
{
    public class MovieReviewerApplication
    {
        // PROPERTIES
        private readonly WebApplicationBuilder _builder;
        private readonly WebApplication _app;

        //Constructor
        public MovieReviewerApplication(string[] args)
        {
            _builder = WebApplication.CreateBuilder(args);

            ConfigureServices();

            _app = _builder.Build();
            ConfigureMiddleswares();
        }

        // ------ PRIVATE METHODS -----

        // ------- Auth -------
        private void AddAuthApi()
        {
            _builder.Services.AddAuthorization();

            _builder.Services.AddIdentityApiEndpoints<CustomUser>(CustomIdentityOptions)
                .AddEntityFrameworkStores<DatabaseContext>();
        }

        private void CustomIdentityOptions(IdentityOptions options)
        {
            if (_builder.Environment.IsDevelopment())
            {
                //Simpler dev passwords for simpler times
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 2;

            }
        }

        // -------- Services  -------
        private void ConfigureServices()
        {
            // Add services to the container
            _builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            _builder.Services.AddEndpointsApiExplorer();
            _builder.Services.AddSwaggerGen(CustomSwaggerGenOptions);

            //Configure database 
            _builder.Services.AddDbContext<DatabaseContext>(options =>
                options.UseSqlite(_builder.Configuration.GetConnectionString("SqlLiteConnection")));

            AddAuthApi();
        }

        private void CustomSwaggerGenOptions(SwaggerGenOptions options)
        {
            options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });

            options.OperationFilter<SecurityRequirementsOperationFilter>(); // Required for using access token
        }

        // -------- Middle wares  -------
        private void ConfigureMiddleswares()
        {
            // Configure the HTTP request pipeline.
            if (_app.Environment.IsDevelopment())
            {
                _app.UseSwagger();
                _app.UseSwaggerUI();
            }

            //To be able to connect the front end to this API
            _app.UseCors(_builder => _builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());



            _app.MapIdentityApi<CustomUser>();

            _app.UseHttpsRedirection();

            _app.UseAuthorization();

            _app.MapControllers();
        }

        // RUN
        public void Run()
        {
            _app.Run();
        }
    }
}
