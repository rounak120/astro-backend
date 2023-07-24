import requests
import cv2
import os
def uploadFile(image):
    temp_image_path="../abc.png"
    cv2.imwrite(temp_image_path,image)
    # image_file_path = "path/to/your/image/file.jpg"  # Replace this with the actual path to your image file
    
   