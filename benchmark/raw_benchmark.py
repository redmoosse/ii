import torch
import time
import logging
import platform
import psutil
import datetime
import wmi
from transformers import AutoTokenizer, AutoModel

timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
log_filename = f"benchmark/logs/benchmark_{timestamp}.log"

logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

w = wmi.WMI()

def get_processor_name():
    try:
        cpu = w.Win32_Processor()[0]
        return cpu.Name.strip()
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

def benchmark(model_name: str, text: str, device_name: str = 'cpu', iterations: int = 10):
    device = torch.device(device_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name).to(device)
    model.eval()

    inputs = tokenizer(text, return_tensors="pt").to(device)

    for _ in range(3):
        with torch.no_grad():
            _ = model(**inputs)

    start_time = time.time()
    for _ in range(iterations):
        with torch.no_grad():
            _ = model(**inputs)
    end_time = time.time()

    avg_time = (end_time - start_time) / iterations
    logging.info(f'Model: {model_name}')
    logging.info(f'Device: {device_name}')
    logging.info(f'Average Inference Time: {avg_time:.4f} seconds')
    print(f'[{device_name.upper()}] Avg inference time: {avg_time:.4f} sec')

if __name__ == "__main__":
    model_name = "dmis-lab/biobert-base-cased-v1.1"
    text = "Aspirin is commonly used as an anti-inflammatory medication."

    system_info = get_system_info()
    for key, value in system_info.items():
        if isinstance(value, list):
            for item in value:
                logging.info(f'{key}: {item}')
                print(f'{key}: {item}')
        else:
            logging.info(f'{key}: {value}')
            print(f'{key}: {value}')

    benchmark(model_name, text, device_name='cpu')

    if torch.cuda.is_available():
        benchmark(model_name, text, device_name='cuda')
    else:
        logging.warning("CUDA is not available on this machine.")
        print("CUDA is not available on this machine.")
