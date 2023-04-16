

update dbo.Cars set CarImage = 
(SELECT * FROM Openrowset(Bulk 'C:\Users\linyo\OneDrive\Desktop\Ella Final Project\EllaCarRental\Images\P3008.jpg', SINGLE_BLOB) as CarImage)
WHERE CarID = 7

