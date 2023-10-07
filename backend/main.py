from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
import shutil
from fastapi.middleware.cors import CORSMiddleware
import csv
import os
import uuid

new_image_folder = '../marked_images'
images_dir = Path("../images")
csv_file_path = 'data.csv'

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",  # Allow requests from your React development server
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all HTTP headers
)


@app.get("/images/")
async def get_images():
    if not images_dir.exists() or not images_dir.is_dir():
        return JSONResponse(content={"error": "Images directory not found"}, status_code=404)

    image_files = [str(file.name) for file in images_dir.glob(
        "*") if file.is_file() and file.suffix in {".jpg", ".jpeg", ".png"}]
    return JSONResponse(content={"images": image_files})


@app.get("/images/{image_name}")
async def get_image(image_name: str):
    image_path = images_dir / image_name

    if not images_dir.exists() or not images_dir.is_dir() or not image_path.exists():
        return JSONResponse(content={"error": "Image not found"}, status_code=404)

    return FileResponse(image_path)


def store_data(data_dict):
    os.makedirs(new_image_folder, exist_ok=True)

    # Check if the CSV file exists, and create it if it doesn't
    file_exists = os.path.exists(csv_file_path)

    with open(csv_file_path, mode='a', newline='') as csv_file:
        fieldnames = list(data_dict.keys())
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # Write header only if the file is newly created

        writer.writerow(data_dict)

    image_name = data_dict['image']
    try:
        shutil.move(os.path.join(
            images_dir, os.path.basename(image_name)), os.path.join(
            new_image_folder, os.path.basename(image_name)))
    except Exception as e:
        return {'error': 'Error moving the image file'}


def format_data(data: dict):
    data_dict = dict()
    data_dict['image'] = data['image']
    options = data['options']
    selected = data['selected']
    for d in options:
        if d in selected:
            data_dict[d] = 'Yes'
        else:
            data_dict[d] = 'No'
    return data_dict


@ app.post("/send-data")
async def receive_data(data: dict):
    try:
        data_dict = format_data(data)
        store_data(data_dict)
        return {'message': 'Data received successfully'}
    except Exception as e:
        raise HTTPException(status_code=500, detail='Error processing data')


@ app.get("/downloadable/")
async def download_file():
    return FileResponse(csv_file_path)


@ app.post("/restart")
async def rename_and_delete_folders():
    old_folder_path = '../images'
    new_folder_path = '../marked_images'
    try:
        shutil.rmtree(old_folder_path)
        shutil.rmtree(new_folder_path)
        images_dir.mkdir(parents=True, exist_ok=True)
        csv_file = Path(csv_file_path)
        if csv_file.exists():
            csv_file.unlink()

        return {"message": "Folders renamed and deleted successfully"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/upload")
async def upload_images(files: list[UploadFile] = File(...)):
    images_dir.mkdir(parents=True, exist_ok=True)

    for file in files:
        file_path = images_dir / (str(uuid.uuid4()) + '.jpg')

        with open(file_path, "wb") as f:
            f.write(file.file.read())

    return {"message": f"{len(files)} images uploaded successfully"}
