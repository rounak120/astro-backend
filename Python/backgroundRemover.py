import cv2
import numpy as np
from skimage import exposure
from skimage import io
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy import ndimage
from skimage import io, color, exposure
import os
import random
import string
import sys
import requests
src = sys.argv[1]
img = io.imread(src)
# Load the image

# Compute the background using a median filter
background = cv2.medianBlur(img, 51)

# Subtract the background from the image
subtracted = cv2.absdiff(img, background)

# Rescale the image for visualization
# print('reached')
subtracted_scaled = cv2.normalize(subtracted, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
filekey=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
# url = "https://api.cloudinary.com/v1_1/dtdehangx/image/upload"
# upload_preset = "chat-app"
# cloud_name = "dtdehangx"

# data = {
#     "upload_preset": upload_preset,
#     "cloud_name": cloud_name
# }
# files = subtracted_scaled 
# files = {
#     "file": open(subtracted_scaled, "rb")  # Replace "path/to/image.jpg" with the actual path to your image file
# }

# response = requests.post(url, data=data, files=files)
# if response.status_code == 200:
#     result = response.json()
#     path = result.get("url")
#     print(path)
# else:
#     print("An error occurred:", response.text)
path='C:/Users/rouna/Desktop/Astro/Backend/Files/'+filekey+'.png'
userPath=path[3:]
userPath=userPath.replace("/","|")
print(filekey+'.png')
# Save the result to a new PNG file
cv2.imwrite(path,subtracted_scaled)