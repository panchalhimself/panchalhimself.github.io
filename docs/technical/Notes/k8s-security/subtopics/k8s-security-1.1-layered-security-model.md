## Layered Security Model

"A layered defense is the only viable defense."



Code < Container < Cluster < Infra

We cannot guarantee 100% security for any one of the above 4 layers.


The underlying assumption is that no layer is 100% bullet proof of the security threats and thus the only approach that is viable to make systems secure is the layered one. 

Essentially secure every layer as much as possible. **secure every thing.**

Layers that are involved in case of Kubernetes:-


1. Applications
2. The Cluster
3. Supply chain (contianer images and other files that can be compromised.)
4. Host Systems/underlying Infra













