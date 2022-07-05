#! /bin/bash
while getopts b: args; do
  case "${args}" in
  b) project_branch=${OPTARG} ;;
  esac
done

if [ ${#project_branch} -lt 2 ]; then
  project_branch="master"
fi

set current working directory
current_dir=$(pwd)
# set working project root folder
project_dir="esatya-rahat"
# absolute path
abs_dir="$current_dir/$project_dir"
# project branch

echo "Present working directory is $current_dir"
#create rahat-directory
[ -d "$abs_dir" ] && echo "$project_dir folder already exists in this directory. Please switch to a different directory or remove the existing folder." && exit 1

echo "Creating directory 'esatya-rahat' ..."
mkdir $project_dir
echo "Successfully created '$project_dir' !"

echo "Creating required project repositories and configurations..."

git clone -b $project_branch https://github.com/esatya/rahat.git $abs_dir/rahat
git clone -b $project_branch https://github.com/esatya/rahat-otp.git $abs_dir/rahat-otp
git clone -b $project_branch https://github.com/esatya/rahat-agency.git $abs_dir/rahat-agency
git clone -b $project_branch https://github.com/esatya/rahat-vendor.git $abs_dir/rahat-vendor
git clone -b $project_branch https://github.com/esatya/rahat-mobilizer.git $abs_dir/rahat-mobilizer

cp $abs_dir/rahat/scripts/docker-ci-test.sh .
cp -r $abs_dir/rahat/scripts/docker-compose/* .

echo "Done! :)"
