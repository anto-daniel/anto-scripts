<h6> [ Procmail + Fetchmail + Mutt ] Setup </h6>
<h6> ============================================== </h6>

<div>configuring procmail+fetchmail+mutt</div>
<p>
apt-get install procmail <br>
apt-get install fetchmail <br>
apt-get install mutt mutt-patched muttprint <br>
</p>
<div> # Edit the config files as I pasted the config and mutt files in procmail-fetchmail-mutt directory <br>
#  Add crontab entry for fetchmail <br>
# crontab -e <br>
*/1 * * * * /usr/bin/fetchmail > /dev/null   # Add this entry so it will pull mails for every 1 min <br> <br>
# ###  1 more thing link /var/mail/username to Inbox in Mail dir <br>
# cd Mail <br>
# ~/Mail <br>
# ln -s /var/mail/username Inbox <br>
</div>

Let me know if you come across any issues during this setup :)
