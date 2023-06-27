## Restricting default access with NetworkPolicies


Network policies help in restricting access to pods in the kuberenetes cluster.

So the network policies restrict all the traffic via default deny network policy, we require to set rules for allowing the needed traffic to the pod.


You can have the pods as part of replica set or deployment or it can be simple pod manifest as well.

All we need to make sure is that it has proper labels for matching the pod.



Example of network policy to restrict access to a pod



**How to restrict access to an entire namespace in a cluster ?**
---

use an empty pod selector and make sure that namespace is defined under the metadata.



**Allow specific traffic in kubernetes to pods and namespaces:**
