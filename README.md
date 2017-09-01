// air zones
https://catalogue.data.gov.bc.ca/dataset/british-columbia-air-zones/resource/c495d082-b586-4df0-9e06-bd6b66a8acd9

will need to download coast (have done before) to make the BC map look normal..

// stations 
https://catalogue.data.gov.bc.ca/dataset/air-quality-monitoring-unverified-hourly-air-quality-and-meteorological-data/resource/7fd21841-b133-4f39-b9b2-6bfa34a7cf6c


// 90 day data
ftp://ftp.env.gov.bc.ca/pub/outgoing/AIR/Hourly_Raw_Air_Data/Air_Quality/aqhi.csv

// hourly data - last 24 hours
https://catalogue.data.gov.bc.ca/dataset/air-quality-monitoring-unverified-hourly-air-quality-and-meteorological-data/resource/3072ab0e-7739-4473-98b3-9cb494c38190


Files loaded from current map

http://www.env.gov.bc.ca/epd/bcairquality/readings/map/station-master-list.xml

Current readings - not loading
http://www.env.gov.bc.ca/epd/bcairquality/aqo/xml/Current_Hour.xml


was loading the station data from here:
https://catalogue.data.gov.bc.ca/dataset/air-quality-monitoring-unverified-hourly-air-quality-and-meteorological-data/resource/7fd21841-b133-4f39-b9b2-6bfa34a7cf6c 

but it doesn't tell you what is measured at each station, so I had to first loaded the 90 file for the selected measure, and then matched the station ids with those from the locations file. Meant I had to load all the data for 90 days just to get the locations.

Then I found out that the current hour data also has station info
https://catalogue.data.gov.bc.ca/dataset/air-quality-monitoring-unverified-hourly-air-quality-and-meteorological-data/resource/3072ab0e-7739-4473-98b3-9cb494c38190
so only need to load this to plot the stations.

The old map is also plotting a 30 day feed for each station:
http://www.env.gov.bc.ca/epd/bcairquality/aqo/xml/E208096_Current_Month.xml

and NOT loading the 90 day file. To match this I'm going to parse the file to 30 days and load directly.






