import cv2
import numpy as np
import sys
import time
from skimage import exposure
from skimage import io
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from scipy import ndimage
from skimage import io, color, exposure
import random
import string
src = sys.argv[1]
image = io.imread(src)
# plt.imshow(image)
# print(image)
image = image / 255.0
image_2d = image.reshape((-1, 3))
k = 7
kmeans = KMeans(n_clusters=k, random_state=0).fit(image_2d)
labels = kmeans.predict(image_2d)
labels_2d = labels.reshape(image.shape[:2])
fig, axs = plt.subplots(nrows=1, ncols=2, figsize=(8, 4), sharex=True,
                        sharey=True)
axs[0].imshow(image)
axs[0].set_title('Original Image')
axs[1].imshow(labels_2d)
axs[1].set_title('Quantized Image')
for ax in axs:
    ax.axis('off')
plt.tight_layout()
path=plt.savefig('abc.png') 

