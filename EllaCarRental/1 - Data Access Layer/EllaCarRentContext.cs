using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace EllaCarRental
{
    //Created by Entity framework --> All the DB context 
    public partial class EllaCarRentContext : DbContext
    {
        public EllaCarRentContext()
        {
        }

        public EllaCarRentContext(DbContextOptions<EllaCarRentContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Branch> Branch { get; set; }
        public virtual DbSet<CarType> CarTypes { get; set; }
        public virtual DbSet<CarsForRent> CarsForRents { get; set; }
        public virtual DbSet<RentCar> RentCars { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Favorites> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            //Entity of the Branch table
            modelBuilder.Entity<Branch>(entity =>
            {
                entity.ToTable("Branch"); 

                entity.Property(e => e.BranchId).HasColumnName("BranchID");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");

                entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            //Entity of the Car Type table
            modelBuilder.Entity<CarType>(entity =>
            {
                entity.HasKey(e => e.TypeId);

                entity.ToTable("CarType");

                entity.HasIndex(e => new { e.Gear, e.Manufacturer, e.Year, e.Model }, "IX_CarType")
                    .IsUnique();

                entity.Property(e => e.TypeId).HasColumnName("TypeID");

                entity.Property(e => e.CostPerDay).HasColumnType("decimal(19, 4)");

                entity.Property(e => e.CostPerDayDelay).HasColumnType("decimal(19, 4)");

                entity.Property(e => e.Gear)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Manufacturer)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Model)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Year)
                    .IsRequired()
                    .HasMaxLength(4);
            });

            //Entity of the Favorite Cars table
            modelBuilder.Entity<Favorites>(entity =>
            {
                entity.HasKey(e => e.FavoriteId);

                entity.ToTable("Favorites");

                entity.Property(e => e.FavoriteId).HasColumnName("FavoriteId");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.CarNumber).HasMaxLength(8);
            });

            //Entity of the Cars table
            modelBuilder.Entity<CarsForRent>(entity =>
            {
                entity.HasKey(e => e.CarNumber)
                    .HasName("PK_CarsForRent_1");

                entity.ToTable("CarsForRent");

                entity.Property(e => e.CarNumber).HasMaxLength(8);

                entity.Property(e => e.Available)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength(true);

              entity.Property(e => e.Image).IsUnicode(false);

              entity.Property(e => e.BranchId).HasColumnName("BranchID");

                entity.Property(e => e.Proper)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.TypeId).HasColumnName("TypeID");

                entity.HasOne(d => d.Branch)
                    .WithMany(p => p.CarsForRents)
                    .HasForeignKey(d => d.BranchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CarsForRent_Branch");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.CarsForRents)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CarsForRent_CarType");
            });

            //Entity of the Rented Cars table
            modelBuilder.Entity<RentCar>(entity =>
            {
                entity.HasKey(e => e.CarNumber);

                entity.Property(e => e.CarNumber).HasMaxLength(8);

                entity.Property(e => e.EndTime).HasColumnType("date");

                entity.Property(e => e.ReturnTime).HasColumnType("date");

                entity.Property(e => e.StartTime).HasColumnType("date");
                 
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.CarNumberNavigation)
                    .WithOne(p => p.RentCar)
                    .HasForeignKey<RentCar>(d => d.CarNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RentCars_CarsForRent");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.RentCars)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RentCars_RentCars");
            });

            //Entity of the Users table
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.HasIndex(e => e.Email, "UniqueEmail")
                    .IsUnique();

                entity.HasIndex(e => e.UserId, "UniqueID")
                    .IsUnique();

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.DateOfBirth).HasMaxLength(15);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(320);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(15);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Id)
                    .IsRequired()
                    .HasMaxLength(9)
                    .HasColumnName("ID");

                entity.Property(e => e.Image).IsUnicode(false);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(15);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(44)
                    .IsUnicode(false);

                entity.Property(e => e.RoleType)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength(true);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
