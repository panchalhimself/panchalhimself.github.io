Before we get started with the Profiling part we should first be clear with overview of the GPU wrt to CPU Servers.

Enterprise GPUs such as H100 and B200 are in a nutshell massively parallel computation accelerators.

They have large amount of processors that perform computationally intensive operations in parallel such as Matrix Multiplication.

By themselves GPUs are useless.

CPUs are the one responsible for commanding the GPUs on what to compute 

Responsibilities of a CPU:

1. Load Data
2. Transfer Data
3. Launch the Kernels 
4. Retrieve Results

In case of NVIDIA GPUs, CUDA is a primary way of programming GPU accelerated programs.

CUDA code is initialized on the CPU first and the portions relevant to the GPUs perform execution on the GPUs

Essentially you code starts on CPU and while running it identifies portions that should be run on GPU based on the syntax and code structure.

What do we mean by identifies ?

Following is a simple vector addition CUDA Code:

Code for CPU:
```
#define N 10000000

void vector_add(float *out, float *a, float *b, int n) {
    for(int i = 0; i < n; i++){
        out[i] = a[i] + b[i];
    }
}

int main(){
    float *a, *b, *out; 

    // Allocate memory
    a   = (float*)malloc(sizeof(float) * N);
    b   = (float*)malloc(sizeof(float) * N);
    out = (float*)malloc(sizeof(float) * N);

    // Initialize array
    for(int i = 0; i < N; i++){
        a[i] = 1.0f; b[i] = 2.0f;
    }

    // Main function
    vector_add(out, a, b, N);
}
```



Code for GPU [CUDA]
```
__global__ void vector_add(float *out, float *a, float *b, int n) {
    for(int i = 0; i < n; i++){
        out[i] = a[i] + b[i];
    }
}

void main(){
    float *a, *b, *out; 
    float *d_a; 

    // Allocate CPU memory for a
    a = (float*)malloc(sizeof(float) * N); // CPU Memory Allocation

    // Allocate GPU memory for a
    cudaMalloc((void**)&d_a, sizeof(float) * N);

    // Transfer data from CPU to GPU memory
    cudaMemcpy(d_a, a, sizeof(float) * N, cudaMemcpyHostToDevice); 

    // Command given by CPU to GPU
    vector_add<<<1,1>>>(out, d_a, b, N); // Execute Kernel on GPU 

    // Cleanup after kernel execution
    cudaFree(d_a);
    free(a);
}
```


So ideally following things occur:

1. Host Memory (CPU) is allocated
2. Device Memory (GPU) is allocated
3. Data loaded in Host Memory (CPU)
4. Loaded data from Host Memory(CPU) is transferred to GPU memory
5. command to execute kernels are given by CPU to GPU
6. The output allocated in the GPU memory is transferred back to CPU memory




