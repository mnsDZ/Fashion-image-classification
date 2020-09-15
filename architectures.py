from keras.applications.inception_v3 import InceptionV3, preprocess_input
from keras.layers import Dense, Activation, Flatten, Dropout, BatchNormalization
from keras.layers import Conv2D, MaxPooling2D
from keras.models import Model

dense_size = 512 #1024
dropout_rate = 0.2 #0.5**0.1
W = 299
H = 299

#Category and Pose Model 
def create_mode_graph(dense_size = dense_size,dropout_rate = dropout_rate,nbr_of_pose_classes=4,nbr_of_category_classes=23):
  #Load the inceptionV3 model
  base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=(W,H, 3)) #incepetionv3
  comun_branch = base_model.output
  comun_branch = Flatten(name="flatten")(comun_branch)
  comun_branch = Dense(dense_size , activation="relu")(comun_branch)
  comun_branch = Dropout(dropout_rate)(comun_branch)

  pose_output = Dense(nbr_of_pose_classes, activation='softmax',name='pose')(comun_branch)
  category_output = Dense(nbr_of_category_classes, activation='softmax',name='category')(comun_branch)

  model = Model( inputs=base_model.input , outputs=[pose_output,category_output] )
  return(model)

#Color Model
def create_mode_graph2(dense_size = dense_size,dropout_rate = dropout_rate,nbr_of_color_classes=28):
  #Load the inceptionV3 model
  base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=( W , H , 3)) #incepetionv3
  model = base_model.output
  model = Flatten(name="flatten")(model)
  model = Dense(dense_size , activation="relu")(model)
  model = Dropout(dropout_rate)(model)  
  model = Dense( nbr_of_color_classes, activation='softmax' )(model)
  model = Model(inputs=base_model.input , outputs = model )
  return(model)
  

