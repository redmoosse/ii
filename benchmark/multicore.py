import time
import logging
import multiprocessing as mp

import torch


# Глобальна змінна для моделі в дочірньому процесі
model = None

def init_worker(model_class):
    global model
    model = model_class()

def run_model_in_subprocess(text):
    global model
    with torch.no_grad():
        return model.process(text)

def benchmark_model(model_class, text: str, device_name='cpu', iterations=10, model_name="biomodel"):
    print(f"\n🚀 Starting benchmark for {model_name} on {device_name}")

 

    # Багатоядерний тест (multiprocessing)
    for workers in [2, 4, 8, mp.cpu_count()]:
        start_mp = time.time()
        with mp.Pool(processes=workers, initializer=init_worker, initargs=(model_class,)) as pool:
            results = pool.map(run_model_in_subprocess, [text] * (iterations * workers))
        end_mp = time.time()
        total_time = end_mp - start_mp
        avg_time = total_time / len(results)
        print(f"[{device_name.upper()}] Parallel ({workers} processes) avg time per inference: {avg_time:.4f} sec")
        logging.info(f"[{device_name.upper()}] Parallel ({workers} processes) avg time per inference: {avg_time:.4f} sec")
