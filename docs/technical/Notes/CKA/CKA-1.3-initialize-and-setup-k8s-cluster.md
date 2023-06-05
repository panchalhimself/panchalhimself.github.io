## Initialize and setup k8s cluster
2 June 2023

---

***Steps to initialize k8s cluster***
--- 
--- 

1. **Initialize the k8s cluster on node1**
      

       kubeadm init --apiserver-advertise-address=192.168.1.101 --pod-network-cidr=192.168.1.0/24 --v=5


       IPADDR="192.168.1.101"
       NODENAME=$(hostname -s)
       POD_CIDR="192.168.1.0/16"

       sudo kubeadm init --apiserver-advertise-address=$IPADDR  --apiserver-cert-extra-sans=$IPADDR  --pod-network-cidr=$POD_CIDR --node-name $NODENAME --ignore-preflight-errors Swap

    To start using your cluster, you need to run the following as a regular user:

       mkdir -p $HOME/.kube
       sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
       sudo chown $(id -u):$(id -g) $HOME/.kube/config

    Alternatively, if you are the root user, you can run:

       export KUBECONFIG=/etc/kubernetes/admin.conf


2. **Setup Calico/WEAVE Net networking interface**

      Use any one of the following CNI setup, I used Weavenet

      Calico

       kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml

      Weavenet

       kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml

3. **Join the other nodes with the node1**

    Paste the output from the node 1 to join the node 1 


--- 

***Vagrantfile and Scripts for setup***
---
--- 

Ensure that the Vagrantfile and setup.sh are in the same folder.



**Vagrantfile**

    Vagrant.configure("2") do |config|
      config.vm.define "db1" do |db1|
        db1.vm.box = "ubuntu/focal64"
        db1.vm.hostname = 'db1'
        db1.vm.box_url = "ubuntu/focal64"
        db1.vm.provision "shell", path: "setup-k8s.sh"
        db1.vm.provision "shell", path: "master.sh"
        db1.vm.network "public_network", ip: '192.168.1.101', bridge: 'enp11s0'
        db1.vm.provider :virtualbox do |v|
          v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
          v.customize ["modifyvm", :id, "--memory", 2000]
          v.customize ["modifyvm", :id, "--name", "db1"]
        end
      end
    
      config.vm.define "db2" do |db2|
        db2.vm.box = "ubuntu/focal64"
        db2.vm.hostname = 'db2'
        db2.vm.box_url = "ubuntu/focal64"
        db2.vm.provision "shell", path: "setup-k8s.sh"
        db2.vm.provision "shell", path: "worker.sh"
        db2.vm.network "public_network", ip: '192.168.1.102', bridge: 'enp11s0'
        db2.vm.provider :virtualbox do |v|
          v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
          v.customize ["modifyvm", :id, "--memory", 2000]
          v.customize ["modifyvm", :id, "--name", "db2"]
          
        end
      end
    
      config.vm.define "db3" do |db3|
        db3.vm.box = "ubuntu/focal64"
        db3.vm.hostname = 'db3'
        db3.vm.box_url = "ubuntu/focal64"
        db3.vm.provision "shell", path: "setup-k8s.sh"
        db3.vm.provision "shell", path: "worker.sh"
        db3.vm.network "public_network", ip: '192.168.1.103', bridge: 'enp11s0'
        db3.vm.provider :virtualbox do |v|
          v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
          v.customize ["modifyvm", :id, "--memory", 2000]
          v.customize ["modifyvm", :id, "--name", "db3"]
          
        end
      end
    end



**setup-k8s.sh**
    
    #!/bin/bash
    
    set +xe
    
    yes y | ssh-keygen -q -t rsa -N '' >/dev/null
    
    echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC4ns0dEv0sJV+rMDftaaTDwsj2y0hf0/vOsPepy+YJzFW4B8dgTa75bN12uexH78Xcth06MkOCiB3iOuIkoxEcQx8JMUiUCiIpNSWTTTjxu4zhx6k68Fw6eczbbBoXenNO6i7lCB1rXsd2NO4JgOEMobi6IzdkOXINV3LX5Pu3zrbxOKSeTIKnVEt3kK0/yrvCEKAg8lyGIuZ6Xh6zOLkbhQGpWDNexQa8kx4K/2QN98dNWAFktihcy1UOZJ4ha17MEsDRxyNb5lixWurv23/BpjbaiywpQbmZ+hAfS3wN2hxMSuP4pwkoCiRBvQjT7fD5jeMJ3YiYVv56VBbf0TAAcLentCowfzEdwPYyExma0J0PXmregNPlaw38KcmlSmUfXn77XRIgJ70aAcq3MscsqlKpIN7AYYbTBuDj/7ENpI8dsJarNWmeHMlfoi0mwI9izPnJim3XODdGWAZlV0CXvG2NpmzASxuKYrf8occNtyjjrD/Fn5DBHuD6PbJn8KE= yash@yash-ThinkPad-P15-Gen-2i" >> ~/.ssh/authorized_keys
    
    cat <<EOF >> /etc/hosts
    192.168.1.101 db1
    192.168.1.102 db2
    192.168.1.103 db3
    EOF
    sudo swapoff -a
    sudo apt-get install -y apt-transport-https 
    cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
    overlay
    br_netfilter
    EOF
    sudo modprobe overlay
    sudo modprobe br_netfilter
    # sysctl params required by setup, params persist across reboots
    cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-iptables  = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.ipv4.ip_forward                 = 1
    EOF
    # Apply sysctl params without reboot
    sudo sysctl --system
    sudo apt-get update
    
    for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
    
    sudo apt-get update
    sudo apt-get install ca-certificates curl gnupg -y
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update
    
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
    
    
    
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
    deb https://apt.kubernetes.io/ kubernetes-xenial main
    EOF
    sudo apt-get update
    sudo apt-get install -y kubelet=1.26.0-00 kubeadm=1.26.0-00 kubectl=1.26.0-00
    sudo apt-mark hold kubelet kubeadm kubectl
    
    sudo rm /etc/containerd/config.toml
    #https://stackoverflow.com/questions/72504257/i-encountered-when-executing-kubeadm-init-error-issue
    sudo systemctl restart containerd
    
    apt-get install net-tools -y

**master.sh** (Setup to provision and initialize control node k8s)

    #!/bin/bash
        
    kubeadm init --apiserver-advertise-address=192.168.1.101 --pod-network-cidr=192.168.1.0/24 --v=5
    
    
    IPADDR="192.168.1.101"
    NODENAME=$(hostname -s)
    POD_CIDR="192.168.1.0/16"
    
    sudo kubeadm init --apiserver-advertise-address=$IPADDR  --apiserver-cert-extra-sans=$IPADDR  --pod-network-cidr=$POD_CIDR --node-name $NODENAME --ignore-preflight-errors Swap
    
    
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    
    
    echo "Setting up Weaveworks Network"
    
    kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
    
    kubectl get nodes
    kubectl get pods --all-namespaces
    kubectl cluster-info
    
    kubeadm token create --print-join-command > index.html
    
    docker run -dit -p 80:80 -v ./index.html:/usr/share/nginx/html/index.html nginx
    
    cat ~/.kube/config > index-config.html
    
    docker run -dit -p 8080:80 -v ./index-config.html:/usr/share/nginx/html/index.html nginx



**worker.sh** (Setup to provision the worker nodes)

    #!/bin/bash
    
    JOIN_COMMAND=$(curl db1:80)
    
    echo "Following is the Join Command:- $JOIN_COMMAND"
    
    $JOIN_COMMAND
    
    curl db1:8080 > /etc/kubernetes/kubelet-admin.conf
    
    echo "KUBECONFIG=/etc/kubernetes/kubelet-admin.conf" >> /etc/environment
    
    source /etc/environment



**Start the vms and provision them using setup.sh using the following command:**

    vagrant up


**ssh into the vms using the following command:**

    vagrant ssh db1

**Note:** You might need to replace **wlp9s0** with your own network interface along with the cidr ranges (here: 192.168.56.0/24).



---

***Executing kubectl commands from worker nodes*** 
---

By default your kubeconfig file of control node is not present in the worker node.
This means that you can only administer cluster from the control node.

In order to admin the cluster from the worker nodes as well, you will need to do the following configurations:-



1. Ensure that the kubectl config file from the control plane node is copied to the worker nodes.

      Usually preset at ~/.kube/config on controller node.


2. Copy the control node kube config file data and paste it in a config file at the worker node. 


3. Set the path using export KUBECONFIG=PATH/TO/YOUR/CONFIG (Can be located anywhere)

   In my case I override /etc/kubernetes/kubelet.conf file with the kubeconfig of the control node.



---

***Exposing the service (sample nginx application)***
---

1. Download the sample manifest of nginx application created by nonanom.

   curl -lo nginx.yaml "https://gist.githubusercontent.com/nonanom/498b913a69cede7037d55e28bb00344e/raw"


**nginx.yaml**

    kind: Service
    apiVersion: v1
    metadata:
    name: nginx
    labels:
       app: nginx
    spec:
    selector:
       app: nginx
    ports:
    - port: 80
       protocol: TCP
       targetPort: 80
    type: ClusterIP
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: nginx
    labels:
       app: nginx
    spec:
    replicas: 1
    selector:
       matchLabels:
          app: nginx
    template:
       metadata:
          labels:
          app: nginx
       spec:
          containers:
          - name: nginx
          image: nginx:latest
          imagePullPolicy: Always
          ports:
          - containerPort: 80
             protocol: TCP


2. Deploy the manifest in the cluster

       kubectl apply --filename nginx.yaml

3. Expose the service (Portforward the service)
      
       kubectl port-forward service/nginx --address 0.0.0.0 8080:80


**Note:** the node from where you execute the command for exposing the service will be the node from which you can access the application service.


Reference: https://nonanom.medium.com/run-nginx-on-kubernetes-ee6ea937bc99
