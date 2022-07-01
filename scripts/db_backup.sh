#!/usr/bin/env bash

### This script backups mongo database to Amazon S3 storage. It stores daily, weekly and monthly files. Requires S3cmd package.

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
ERROR="`tput setaf 1`ERROR:`tput sgr0`"
SUCCESS="`tput setaf 2`SUCCESS:`tput sgr0`"
TIMESTAMP=`date '+%Y-%m-%d %H:%M:%S'`
todayName="$(date +%a)"
todayNumber="$(date +%d)"
APPCODE="[DBBAK]"

BACKUP_PATH=/root/db_backups
S3_PATH=s3://rumsan-backups/databases

mkdir -p $BACKUP_PATH

###### Functions #####
LOG(){
  LOGFILE=/root/db_backup.log
  LOG=$1
  if [ ! -f "$LOGFILE" ]; then
    echo "---- Log started ---" >> $LOGFILE
  fi

  if [ ${#LOG} -lt 1 ]; then
    exit 1
  fi

  echo "$TIMESTAMP $APPCODE: $LOG" | cat - $LOGFILE > temp && mv temp $LOGFILE
}

###### Get Varuables #####

while getopts d:p:u:m: option
do 
    case "${option}"
        in
        d)db=${OPTARG};;
        u)user=${OPTARG};;
        p)pass=${OPTARG};;
        m)demand=${OPTARG};;
    esac
done

if [ ${#db} -lt 2 ]; then
  echo "${ERROR} Must send database name (also username)" >&2
  exit 1
fi

if [ ${#user} -lt 2 ]; then
  echo "${ERROR} Must send database username" >&2
  exit 1
fi

if [ ${#pass} -lt 2 ]; then
  echo "${ERROR} Must send database password" >&2
  exit 1
fi


###### Backup ##### 
echo "${green}====================== BACKUP DB: $db ==========================${reset}"
TODAY=`date '+%Y-%m-%d-%H%M'`
FILE=$TODAY@$db.gz
LATESTFILE=latest@$db.gz
mongodump -h localhost:27017 -u $user -p $pass --authenticationDatabase admin -d $db --archive=$BACKUP_PATH/$FILE --gzip
sleep .5
cp $BACKUP_PATH/$FILE $BACKUP_PATH/$LATESTFILE

echo "${green}Uploading to AWS-S3 $S3_PATH/$db/ ${reset}"
sleep .5
s3cmd put $BACKUP_PATH/$LATESTFILE $S3_PATH/latest/ --storage-class=STANDARD_IA

if [ "$demand" != "1"  ]; then
  echo "Scheduled upload to S3"
  s3cmd put $BACKUP_PATH/$FILE $S3_PATH/daily/$db/ --storage-class=STANDARD_IA
  [ "$todayName" = "Sat" ] && s3cmd put $BACKUP_PATH/$FILE $S3_PATH/weekly/$db/ --storage-class=STANDARD_IA
  [ "$todayNumber" = "01" ] && s3cmd put $BACKUP_PATH/$FILE $S3_PATH/monthly/$db/ --storage-class=STANDARD_IA
fi

rm -r $BACKUP_PATH/$FILE

##### delete file older than 10 days
find $BACKUP_PATH/* -type d -ctime +10 | xargs rm -rf
echo "${green}====================== SUCCESS ==========================${reset}"
LOG "Backup Success: $FILE"