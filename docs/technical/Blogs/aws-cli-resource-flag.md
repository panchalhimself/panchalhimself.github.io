# AWS CLI regional selection flag
10 Jun 2023


***AWS CLI and Resource filtering***
--


So I was trying to find the name of an ami using the ami-id, I know that it can be done using gui as well but it consumes more time.

Came across this cloudshell and boom it is like heaven for quering and filtering resources.

My use case was **"JUST TELL ME THE NAME OF THE AMI FROM ITS ID !!!!!!!!"** 


The following query helped me :-

```
aws ec2 describe-images --filters "Name=image-id,Values=AMI_ID_GOES_HERE" --region us-west-1

```

**--region** is the OG here, add it with whichever resource query you want. This flag is your best friend.



