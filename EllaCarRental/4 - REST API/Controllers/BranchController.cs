using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

namespace EllaCarRental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("LocalhostDevelopment")]
    public class BranchController : ControllerBase, IDisposable
    {

        private readonly BranchLogic logic;

        public BranchController(BranchLogic logic)
        {
            this.logic = logic;
        }

        //Post /api/Branch/addBranch
        [HttpPost]
        [Route("addBranch")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Add a new branch to the DB
        public IActionResult AddBranch(Branch branch) 
        {
            try
            {
                Branch addedBranch = logic.AddBranch(branch);
                return Created("api/Branch/addBranch" + addedBranch.BranchId, addedBranch);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/getAllBranches
        [HttpGet]
        [Route("getAllBranches")]
        //Get all branches from DB
        public IActionResult GetAllBranches()
        {
            try
            {
                List<BranchModel> branches = logic.GetAllBranches();
                return Ok(branches);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Branch/getLocation
        [HttpGet]
        [Route("getLocation/{address}")]
        //Get Location of a specific address
        public IActionResult GetLocation(string address)
        {

            LocationModel location = new LocationModel();

            try 
            {
                //Connect to Position Stack API --> free api for location data
                var request = (HttpWebRequest)WebRequest.Create("http://api.positionstack.com/v1/forward?access_key=f6f5278d22a8f0799c36146206e1c889&query="+ address);
                var response = (HttpWebResponse)request.GetResponse();
                string responseString;
                using (var stream = response.GetResponseStream())
                {
                    using (var reader = new StreamReader(stream))
                    {
                        responseString = reader.ReadToEnd();
                    }
                }

                //Example of JSON answer:
                //{"data":[{"latitude":32.43645,"longitude":34.91956,"type":"locality","name":"Hedora","number":null,"postal_code":null,"street":null,"confidence":1,"region":"Haifa","region_code":"HA","county":"Hadera","locality":"Hedora","administrative_area":null,"neighbourhood":null,"country":"Israel","country_code":"ISR","continent":"Asia","label":"Hedora, HA, Israel"},{"latitude":32.489993,"longitude":34.980481,"type":"county","name":"Hadera","number":null,"postal_code":null,"street":null,"confidence":0.4,"region":"Haifa","region_code":"HA","county":"Hadera","locality":null,"administrative_area":null,"neighbourhood":null,"country":"Israel","country_code":"ISR","continent":"Asia","label":"Hadera, HA, Israel"},{"latitude":27.02516,"longitude":79.36543,"type":"locality","name":"Hadera","number":null,"postal_code":null,"street":null,"confidence":1,"region":"Uttar Pradesh","region_code":"UP","county":"Mainpuri","locality":"Hadera","administrative_area":null,"neighbourhood":null,"country":"India","country_code":"IND","continent":"Asia","label":"Hadera, UP, India"},{"latitude":26.06944,"longitude":74.56121,"type":"locality","name":"Hadera","number":null,"postal_code":null,"street":null,"confidence":1,"region":"Rajasthan","region_code":"RJ","county":"Ajmer","locality":"Hadera","administrative_area":null,"neighbourhood":null,"country":"India","country_code":"IND","continent":"Asia","label":"Hadera, RJ, India"}]}

                JObject json = JObject.Parse(responseString);

                var jsonData = json["data"];

                //Get latitude & longitude from JSON
                var jsonLat = jsonData[0]["latitude"];
                var jsonLon = jsonData[0]["longitude"];

                location.Latitude = Convert.ToDecimal(jsonLat.ToString());
                location.Longitude = Convert.ToDecimal(jsonLon.ToString());

                return Ok(location); 
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }


        }

        //Get /api/Branch/getBranchInfoByBranchId/branchId
        [HttpGet]
        [Route("getBranchInfoByBranchId/{branchId}")]
        //Get branch from DB by brach id
        public IActionResult GetBranchInfoByBranchId(int branchId)
        {
            try
            {
                BranchModel branch = logic.GetBranchInfoByBranchId(branchId);
                return Ok(branch);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //PUT /api/Branch/updateBranch
        [HttpPut]
        [Route("updateBranch")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Update branch
        public IActionResult UpdateBranch(Branch branch)
        {
            try
            {
                int id = branch.BranchId;

                Branch updatedBranch = logic.UpdateBranch(branch);


                if (updatedBranch == null) 
                    return NotFound($"branch id {id} Not found.");

                return Ok(updatedBranch);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        public void Dispose()
        {
            logic.Dispose();
        }

    }
}
