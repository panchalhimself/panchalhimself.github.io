## Using jsonpath for kubectl


So here is the most beautiful approach when it comes to finding, arranging and filtering resources as per your needs using kubectl: **jsonpath** 



Let us see the basics of the **jsonpath** 

Most of the independent references need to be inside curly braces **{}**

**range**

range is something really cool, it lets us iteratively get resource details.

```kubectl get pods -A -o jsonpath='{range .items[*]}{.spec.containers[*].name}{"\t"}{"\n"}{end}'```

The above command lets you get the container names of the all pods in the all the namespaces.




```kubectl get pods -A -o jsonpath='{range .items[*]}{.spec.containers[*].name}{"\t"}{.metadata.name}{"\n"}{end}'```


```kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'```




**reference:** https://kubernetes.io/docs/reference/kubectl/jsonpath/
