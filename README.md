# NeuralMusic
# A TechLabs 2020 Project

Make sure you install the requirements first!
Here is how:
>> pip install -r requirements.txt


To deploy this on Amazon EBS:
- Make sure you remove "tensorflow" from requirements. Create a zip file and upload it.
- Put "tensorflow" back into requirements.txt. Create a new ZIP file and upload it. The reason of this is that EBS may run out of memory when installing all packages at once.
- Go into your EBC Configuration->Software. Under the "Static files" tab, make sure path "/static/" points to directory "app/static/". By default, it points to "/static".