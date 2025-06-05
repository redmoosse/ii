# 📊 Benchmark Guide

This guide describes how to benchmark models in this project, interpret results, and understand the difference between the benchmarking tools provided.

---

## 🚀 How to Run Benchmarks

Make sure the required dependencies are installed:

```bash
pip install -r requirements.txt
```

Then run one of the benchmark scripts:

### ▶️ Raw HuggingFace Model Benchmark

Benchmarks raw models directly from HuggingFace (without using internal project structure):

```bash
python benchmark/raw_benchmark.py
```

### ▶️ Project-Based Model Benchmark

Benchmarks models inside the `/model/` folder using the internal model API defined by each model’s `model.py` file:

```bash
python benchmark/benchmark.py
```

You will see an interactive menu like:

```
[0] - Benchmark All models  
[1] - Benchmark biobert  
[2] - Benchmark biogpt  
Enter selection (comma-separated for multiple): 
```

Enter `0` to benchmark all models or a comma-separated list of model numbers (e.g., `1,2`).

> ⚠️ Folders like `example` and `base-cpu` are ignored.

---

## 🧠 Difference Between Scripts

| Script | Purpose |
|--------|---------|
| `raw_benchmark.py` | Tests the inference performance of a HuggingFace model (e.g., BioBERT) directly using `transformers` library. |
| `benchmark.py` | Tests the actual models implemented in the project (e.g., `model/biobert/model.py`) using their `BioModel` class with `.process(text)` method. This better reflects real-world performance in your project. |

---

## 📂 Log Output

All logs are saved in the `benchmark/logs/` directory:

```
benchmark/logs/benchmark_YYYYMMDD_HHMMSS.log
```

Each log includes:

- System Information
- Processor, GPU, RAM
- Per-model benchmark time on CPU and/or GPU

Example structure:

```
Processor: Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz
CPU Cores: 8
Logical CPUs: 8
RAM (GB): 32.0
Motherboard: ASUS PRIME Z390-A

[CPU] Avg inference time: 0.1453 sec — biobert  
[GPU] Avg inference time: 0.0212 sec — biobert  
...
```

---

## ✅ Benchmark Results

Below is a sample table of results:

| Device (Cores/Threads) | biobert | biobert-classificator | biogpt |
|------------------|--------|--------|--------|
| i9-13900H (14/20)| 0.1007 | 0.0350 | 9.0559 |
| i3-12100F (4/8)  | 0.1100 | 0.0318 | 9.3947 |