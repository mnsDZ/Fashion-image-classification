from __future__ import division, print_function

import sys
import os
import glob
import re
import numpy as np
import cv2  
# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image
from keras.preprocessing.image import img_to_array
# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename

from classes import *
from architectures import *

# Define a flask app
app = Flask(__name__)

model = create_mode_graph()
model.load_weights('model/model_weights.h5')

model2 = create_mode_graph2()
model2.load_weights('model/28_color_weight.h5')

print('Created Models Succecful')

def model_predict(img_path, model):
    img = cv2.imread(img_path)
    img = cv2.resize(img, ( W , H ))
    img = img.astype("float") / 255.0
    img = img_to_array(img)
    img = np.expand_dims( img , axis=0 )

    ( PoseProba , CategoryProba ) = model.predict(img)

    return ( PoseProba , CategoryProba )

def model_predict2( img_path , model ) :
    img = cv2.imread(img_path)
    img = cv2.resize(img, ( W , H ))
    img = img.astype("float") / 255.0
    img = img_to_array(img)
    img = np.expand_dims( img , axis=0 )

    colorProba = model.predict(img)
    return colorProba

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        ( PoseProba , CategoryProba ) = model_predict( file_path , model )
        Color_Proba = model_predict2( file_path , model2 )
        
        CategoryIdx = CategoryProba[0].argmax()
        PoseIdx = PoseProba[0].argmax()
        ColorIdx = Color_Proba[0].argmax()

        categoryLabel = category_classes[CategoryIdx]
        poseLabel = pose_classes[PoseIdx]
        colorLabel = color_classes[ColorIdx]

        # categoryText = "{} ({:.0f} %)".format( categoryLabel , CategoryProba[0][CategoryIdx] * 100 )

        # poseText = "{} ({:.0f} %)".format( poseLabel , PoseProba[0][PoseIdx] * 100 )

        # colorText = "{} ({:.0f} %)".format( colorLabel , Color_Proba[0][ColorIdx] * 100 )

        cat = " {},{:.2f} ".format( categoryLabel , CategoryProba[0][CategoryIdx]  )
        pose = " {},{:.2f} ".format( poseLabel , PoseProba[0][PoseIdx]  )
        color = " {},{:.2f} ".format( colorLabel , Color_Proba[0][ColorIdx] )

        result = str(cat) + " - " + str(pose) + " - " + str(color)
    
        return result

    return None


if __name__ == '__main__':
    app.run(debug=True)