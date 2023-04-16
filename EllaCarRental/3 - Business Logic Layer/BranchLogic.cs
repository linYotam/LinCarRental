using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class BranchLogic : BaseLogic
    {
        //Dependency Injection
        public BranchLogic(EllaCarRentContext db) : base(db) { }

        //Get all branches from DB
        public List<BranchModel> GetAllBranches()
        {
            return DB.Branch.Select(branch => new BranchModel(branch)).ToList(); 
        }

        //Get One branch from DB by the given branch ID
        public BranchModel GetBranchInfoByBranchId(int branchId)
        {
            return DB.Branch.Where(branch => branch.BranchId == branchId).Select(branch => new BranchModel(branch)).SingleOrDefault();
        }

        //Add a new branch to the DB
        public Branch AddBranch(Branch branch)
        {
            DB.Branch.Add(branch);
            DB.SaveChanges(); 
            return branch;
        }

        //Update an existing branch
        public Branch UpdateBranch(Branch b)
        {

            Branch branch = DB.Branch.SingleOrDefault(branch => b.BranchId== branch.BranchId);

            //No branch with given branch Id was found in DataBase
            if (branch == null)
                return null;

            branch.BranchId = b.BranchId;
            branch.Address = b.Address;
            branch.Latitude = b.Latitude;
            branch.Longitude = b.Longitude;
            branch.City= b.City;
            branch.Name = b.Name;

            DB.SaveChanges(); 

            return b;
        }
    }
}
