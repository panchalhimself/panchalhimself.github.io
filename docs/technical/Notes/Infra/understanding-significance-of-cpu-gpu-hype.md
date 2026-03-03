# Understanding the significance of the CPU in the age of GPU.


## Why does CPU matter ?

With the exponential growth of AI models the **primary compute component that is being focused** right now is **GPU**. Most of the people are out there gauging for the latest GPU benchmarks and talking about how to use GPUs. However the significance of CPU is being undermined due to this hype.

Most new folks (students and new engineers) are emphasising more on the GPU benchmarks than understanding the system as a whole. 

While GPU capacity matters a alot, we are reaching a point where **Compute is cheap while the loading and unloading of the data is becoming expensive in terms of time**.

### CPUs are still critical component

Let us understand why CPU is essential to any AI workload.


Understanding the flow of an opensource model inference:

1. Downloading model from the internet (Gets stored in the Harddrive)
2. Running AI workload 

    1. The stored model is moved from Harddrive to the **CPU** memory first
    2. **CPU** then moves this stored model from **CPU** memory to GPU memory
    3. Model needs input parameters these are transferred from **CPU** memory to the GPU memory.
    4. Execution of the workload (**CPU** tells the GPU to use the stored model and start execution)
    5. Post execution of the workload the output resides in the GPU memory.
    6. This stored output is moved from GPU memory to **CPU** memory.

The steps 1. and 2. are a one time steps, but the steps 3 to 6 happen during each inference request.

In the entire flow above the shots are called by **CPU**.






