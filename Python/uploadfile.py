import requests
import cv2
def uploadFile(image):
    url = "https://api.cloudinary.com/v1_1/dtdehangx/image/upload"
    upload_preset = "chat-app"
    cloud_name = "dtdehangx"
    # image_file_path = "path/to/your/image/file.jpg"  # Replace this with the actual path to your image file

    data = {
        "upload_preset": upload_preset,
        "cloud_name": cloud_name,
    }

    files = {
        "file": image,
    }

    response = requests.post(url, data=data, files=files)
    print(response.text)
    # print(data)
    # response = requests.post(url, data=data)
    print(response)
    uploaded_url = response.json().get("url")
    print(uploaded_url)
    return uploaded_url
    