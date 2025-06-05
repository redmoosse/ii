import os
import time
import logging
import platform
import psutil
import datetime
import importlib.util
import torch
import wmi
from flask import Flask
from concurrent.futures import ThreadPoolExecutor

timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
log_filename = f"benchmark/logs/benchmark_{timestamp}.log"
os.makedirs(os.path.dirname(log_filename), exist_ok=True)

logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

w = wmi.WMI()

def get_processor_name():
    try:
        return w.Win32_Processor()[0].Name.strip()
    except:
        return platform.processor()

def get_motherboard_info():
    try:
        board = w.Win32_BaseBoard()[0]
        return f"{board.Manufacturer} {board.Product}".strip()
    except:
        return "Unknown"

def get_system_info():
    info = {
        "Processor": get_processor_name(),
        "CPU Cores": psutil.cpu_count(logical=False),
        "Logical CPUs": psutil.cpu_count(logical=True),
        "RAM (GB)": round(psutil.virtual_memory().total / (1024 ** 3), 2),
        "Motherboard": get_motherboard_info(),
    }

    if torch.cuda.is_available():
        info.update({
            'GPU': torch.cuda.get_device_name(0),
            'GPU Memory (GB)': round(torch.cuda.get_device_properties(0).total_memory / (1024 ** 3), 2)
        })

    return info

def run_single_inference(model, text):
    with torch.no_grad():
        return model.process(text)

def benchmark_model(model_class, text: str, device_name='cpu', iterations=10, model_name="biomodel"):
    model = model_class()

    for _ in range(3):
        run_single_inference(model, text)

    # Single-thread benchmark
    start = time.time()
    for _ in range(iterations):
        run_single_inference(model, text)
    end = time.time()
    avg_time = (end - start) / iterations
    print(f"[{device_name.upper()}] Avg inference time for {model_name}: {avg_time:.4f} sec")
    logging.info(f"[{device_name.upper()}] Avg inference time for {model_name}: {avg_time:.4f} sec")

    # Multi-threaded benchmark
    for workers in [2, 4, 8, 20]:
        def worker_fn():
            for _ in range(iterations):
                run_single_inference(model, text)

        start_parallel = time.time()
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = [executor.submit(worker_fn) for _ in range(workers)]
            for f in futures:
                f.result()
        end_parallel = time.time()
        total_time = end_parallel - start_parallel
        avg_time_per_worker = total_time / (workers * iterations)
        print(f"[{device_name.upper()}] Parallel ({workers} threads) avg time per inference: {avg_time_per_worker:.4f} sec")
        logging.info(f"[{device_name.upper()}] Parallel ({workers} threads) avg time per inference: {avg_time_per_worker:.4f} sec")

def load_model_class(model_dir: str):
    model_path = os.path.join("model", model_dir, "model.py")
    spec = importlib.util.spec_from_file_location("model_module", model_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.BioModel

def main():
    text = "Aspirin is commonly used as an anti-inflammatory medication."

    system_info = get_system_info()
    for key, value in system_info.items():
        print(f"{key}: {value}")
        logging.info(f"{key}: {value}")

    excluded_dirs = {'example', 'base-cpu'}

    model_dirs = [
        name for name in os.listdir("model")
        if os.path.isdir(os.path.join("model", name))
        and os.path.isfile(os.path.join("model", name, "model.py"))
        and name not in excluded_dirs
    ]

    print("\nAvailable benchmarks:")
    print("[0] - Benchmark ALL models")
    for idx, name in enumerate(model_dirs, start=1):
        print(f"[{idx}] - Benchmark {name}")

    selection = input("Enter numbers (comma-separated): ").strip()

    if not selection:
        print("❌ No selection made. Exiting.")
        return

    selected_indexes = [int(i) for i in selection.split(',') if i.strip().isdigit()]
    if 0 in selected_indexes:
        selected_models = model_dirs
    else:
        selected_models = [model_dirs[i - 1] for i in selected_indexes if 1 <= i <= len(model_dirs)]

    for model_name in selected_models:
        try:
            print(f"\n🔬 Benchmarking model: {model_name}")
            model_class = load_model_class(model_name)
            benchmark_model(model_class, text, device_name="cpu", model_name=model_name)
        except Exception as e:
            logging.error(f"Error benchmarking model {model_name}: {e}")
            print(f"❌ Failed to benchmark {model_name}: {e}")

if __name__ == "__main__":
    main()
