# CKA-1.2 Basic Setup (3 Node k8s cluster)
2 Jun 2023:

### *Setup:* 
* 3 node cluster with 1 control node.
* using vagrant and bash

### *requirements:*
* ubuntu 20.04 focal vagrant box
* vagrant 2.3.4
* virtualbox 6.1


## *Steps overview for the basic setup:-*

ensure that swap is disabled on all the nodes before starting the setup.
        
    sudo swapoff -a

ensure following packages are installed in your system :-

    packages :-
        apt-transport-https
        curl

    sudo apt-get install -y apt-transport-https curl

Execute the following steps on all the nodes :- 

1. setup the hostname across all the nodes, ensure that the appropriate mappings are present for all the nodes in /etc/hostname (use private ip)

2. Install containerd on all the nodes.
    * ensure that certain kernel modules are loaded before installation of other components:-

        *    overlay
        *    br_netfilter

          cat << EOF | sudo tee /etc/modules-load.d/containerd.conf   
          overlay                 
          br_netfilter          
          EOF

        load them using modprobe command, as follows :-

          sudo modprobe overlay
          sudo modprobe br_netfilter

    * ensure that the networking configs (system level) are present.

          cat << EOF | sudo tee /etc/sysctl.d/99-k8s-cri.conf
          net.bridge.bridge-nf-call-iptables = 1
          net.ipv4.ip_forward = 1
          net.bridge.bridge-nf-call-ip6tables = 1
          EOF


        loaded at restart, optionally if need to reload immediately execute the following:-

          sysctl --system

3. install and configure containerd and docker


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


4. setup k8s package repository

       curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
       
       cat << EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
       deb https://apt.kubernetes.io/ kubernetes-xenial main
       EOF

       sudo apt-get update


5. install k8s packages

    
       We install following 3 packages:-
        * kubelet
        * kubeadm
        * kubectl

       sudo apt-get install -y kubelet=1.24.0-00 kubeadm=1.24.0-00 kubectl=1.24.0-00 

    You can edit the version as per your requirement. I used 1.24.0-00

6. hold the packages (mark them) from auto upgrade.
        
       sudo apt-mark hold kubelet kubeadm kubectl

