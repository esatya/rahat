FROM node:14.17.0-alpine3.13
RUN apk add --update bash git
#set working directory
WORKDIR /usr/src/app 
COPY . .
#install packages
RUN yarn
#expose application working port
EXPOSE 3601
CMD ["yarn","production"]


