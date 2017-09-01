# download and parse data to 30 days
setwd('//Users//matbrown//Projects//airquality')

library(dplyr)
library(downloader)

# get da data
url='ftp://ftp.env.gov.bc.ca/pub/outgoing/AIR/Hourly_Raw_Air_Data/Air_Quality/'

my.files <- c("aqhi.csv", "NO2.csv", "SO2.csv")

for(i in 1:length(my.files)) {
  download(paste0(url,my.files[i]),my.files[i])
  # get data from Aug1
  currFile <- read.csv(my.files[i])
  #format as date
  currFile$Date <-as.Date(currFile$DATE_PST)
  
  augData <- currFile %>%
    filter(Date > "2017-07-31")
  
  augData <- augData[,-length(augData)]
  write.csv(augData, file=paste0("Aug-",my.files[i]), row.names=F)
}

# filename <- "aqhi.csv"
# if (!file.exists(filename)) download(url,filename)

