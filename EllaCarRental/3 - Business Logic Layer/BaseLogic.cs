using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public abstract class BaseLogic : IDisposable
    {

        protected readonly EllaCarRentContext DB;

        //Dependency Injection
        public BaseLogic(EllaCarRentContext db)
        {
            this.DB = db; 
        }

        public void Dispose()
        {
            DB.Dispose();
        }
    }
}
