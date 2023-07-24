import cv2
import numpy as np
from skimage import exposure
from skimage import io
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy import ndimage
from skimage import io, color, exposure
import sys
import string
from uploadfile import uploadFile
import random
import time
# Load the image
start_time = time.time()
src = sys.argv[1]
img = io.imread(src)
# print(img)
# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Apply thresholding to binarize the image
_, thresh = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)

# Apply morphological opening to remove noise and fill gaps between stars
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

# Find contours in the image
contours, _ = cv2.findContours(opening, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Draw a circle around each detected contour
for contour in contours:
    (x, y), radius = cv2.minEnclosingCircle(contour)
    center = (int(x), int(y))
    radius = int(radius)
    cv2.circle(img, center, radius, (0, 0, 255), 2)
uploaded_url=uploadFile(img)