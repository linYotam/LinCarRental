using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //Enable CORS - Entire World
            services.AddCors(setup => setup.AddPolicy("EntireWorld", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
            //Enable CORS - Only Local host
            services.AddCors(setup => setup.AddPolicy("LocalhostDevelopment", policy => policy.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:5000").AllowAnyMethod().AllowAnyHeader()));

            //Register CarRentalDBContext for future DI & Get Connection string from appsettings.json
            services.AddDbContext<EllaCarRentContext>(options => options.UseSqlServer(Configuration.GetConnectionString("EllaCarRent")));

            //Register CarsLogic for future DI.
            services.AddTransient<CarsLogic>();

            //Register UsersLogic for future DI.
            services.AddTransient<UsersLogic>();

            //Register BranchLogic for future DI.
            services.AddTransient<BranchLogic>();

            //Get token key
            JwtHelper jwtHelper = new JwtHelper(Configuration.GetValue<string>("JWT:Key"));
            //services.AddTransient(jwtHelper);
            services.AddSingleton(jwtHelper); 

            //Enable JWT Authentication.
            services.AddAuthentication(options => jwtHelper.SetAuthenticationOptions(options)).AddJwtBearer(options => jwtHelper.SetBearerOptions(options));

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "_4___REST_API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "_4___REST_API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            //User CORS Policies
            app.UseCors("EntireWorld");

            app.UseAuthentication(); //Check users authentication.
            app.UseAuthorization(); //Check the authorization of the user.
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
