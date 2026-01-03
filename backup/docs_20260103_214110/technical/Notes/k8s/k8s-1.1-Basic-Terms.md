# **CKA Notes-1.1: Basic Terms and Overview** 
2 Jun 2023:



## *K8s Components*
---



**k8s-control-plane:** 
* Responsible for managing the cluster.
* Can be on a single machine or can span across multiple servers (Usually across dedicated controller machines).

### *Following are the 5 main control plane components:-*

---

**kube-api-server:**
* Serves the K8s API
* Primary interface to interact with k8s cluster and is a central component.

**etcd:**
* HA backend data store for the k8s cluster.
* data stored is related to the state of the cluster.

**kube-scheduler**
* handles scheduling: selecting the node to run containers.

**kube-controller-manager**
* Single process
* Runs collection of controller utilities.
    * **controllers:** execute various automation related tasks inside the cluster.

**cloud-controller-manager**
* provides interfaces between the cluster and cloud providers.
* useful only when you need to interact with cloud providers from the cluster.


These components can be on same server or can be spread across multiple servers.

In case of HA requirement these components can have more than single instance running simultaneously across multiple servers.

---

## Kubernetes Nodes (Worker Nodes)

* containers managed by cluster run here.
* can have any no of nodes.
* has node components on the server that communicate with the control plane via *kube-api-server*

### **Node components:-**
* **kubelet**
    * k8s agent
    * ensures that containers are run on its node.
    * communicates with control plane and follows what it commands.
    * communicates with control plane regarding node status and various info of the running containers.

* **container-runtime**
    * container software for actual container process.
    * ex: docker and contianerd

* **kube-proxy**
    * Network proxy
    * runs on each node
    * handles networking between containers and servers in the cluster
