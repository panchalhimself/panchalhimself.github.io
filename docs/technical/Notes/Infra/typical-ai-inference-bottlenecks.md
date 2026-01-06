# Present bottlenecks with regards to AI inference.


## Observation is for Inference

Computation is easy access and loading/unloading to memory is expensive.

We are now able to do MatMul way more quickly then we can load and store the data to the nearby memory conmponents.

So most of the AI inference is now memory bound instead of compute bound.

Examples:

Loading Model Weights: Memory intensive
Activation movement between layers: Memory intensive
Attention (KV access): Memory intensive
Matrix Multiplication and Vector Computation: Compute intensive

So now FLOPS are way way faster than the available memory bandwidth at least during the inference.

Inference is Memory bounded

While training on the other hand is compute heavy.

So typical LLMs and Diffusion models have idle SMs while GPU memory are utilized most of the time due to weight loading and memory transfers.


