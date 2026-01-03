# Filter aws resources efficiently using aws cli
13 Jun 2023


***Filtering active ec2 instances before certain date***
--


So I was trying to find details of the ec2 instances that were up before certain date.


The following command helped me in getting list of active ec2 instances before 1 January 2023 :-

```bash
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[].Instances[?LaunchTime<='2023-01-01'].[Tags[?Key=='Name'].Value[], InstanceId, LaunchTime]" --output yaml --region $1 | sed -e 's/\- \[\]//g' -e '/^$/d'
```


```--filters``` In our case we filtered the instances using instance state. We needed running instances, so ***Values=running***. In a nutshell **--filters** is the first thing that you need to pay attention to. They work on the tag level.

```--query``` Once things are filtered you will get large output. You need to query the filtered output to get the required data. Essentially we neeed running instances before 1st January 2023. so the instances running before 1st January 2023 was queried using this flag.

```--output``` Can have multiple return types like json, table, yaml, etc as a reponse. In our case we chose yaml.

```--region``` is the OG here, add it with whichever resource query you want. This flag is your best friend for region specific resource search.


```sed -e 's/\- \[\]//g' -e '/^$/d'``` In the end we got large list of data partially filled unwanted crap. In order to remove them we use sed.


