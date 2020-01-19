#!/bin/bash
####################################
#
# Backup to NFS mount script.
#
####################################

# What to backup. 
backup_files="/home /etc /root /usr/share/nginx"

# Where to backup to.
dest="/backup"

if [[ ! -d $dest ]]; then
	sudo mkdir $dest
	echo "backup directory created"
fi

# Create archive filename.
day=$(date +%A)
hostname=$(hostname -s)
archive_file="$hostname-$day.tgz"

# Print start status message.
echo "Backing up $backup_files to $dest/$archive_file"
date
echo

# Backup the files using tar.
tar cvzf $dest/$archive_file -X node_modules -X .* $backup_files

# Print end status message.
echo
echo "Backup finished"
date

# Long listing of files in $dest to check file sizes.
ls -lh $dest
