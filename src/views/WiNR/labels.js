const Labels = {
  labels: {
    fashion: {
      0: 'T-shirt',
      1: 'Trouser',
      2: 'Pullover',
      3: 'Dress',
      4: 'Coat',
      5: 'Sandal',
      6: 'Shirt',
      7: 'Sneaker',
      8: 'Bag',
      9: 'Ankle boot'
    },
    cifar10: {
      0: 'Airplane',
      1: 'Automobile',
      2: 'Bird',
      3: 'Cat',
      4: 'Deer',
      5: 'Dog',
      6: 'Frog',
      7: 'Horse',
      8: 'Ship',
      9: 'Truck'
    },
    gtsrb: {
      0: 'Speed limit (20km/h)',
      1: 'Speed limit (30km/h)',
      2: 'Speed limit (50km/h)',
      3: 'Speed limit (60km/h)',
      4: 'Speed limit (70km/h)',
      5: 'Speed limit (80km/h)',
      6: 'End of speed limit (80km/h)',
      7: 'Speed limit (100km/h)',
      8: 'Speed limit (120km/h)',
      9: 'No passing',
      10: 'No passing for vehicles over 3.5 metric tons',
      11: 'Right-of-way at the next intersection',
      12: 'Priority road',
      13: 'Yield',
      14: 'Stop',
      15: 'No vehicles',
      16: 'Vehicles over 3.5 metric tons prohibited',
      17: 'No entry',
      18: 'General caution',
      19: 'Dangerous curve to the left',
      20: 'Dangerous curve to the right',
      21: 'Double curve',
      22: 'Bumpy road',
      23: 'Slippery road',
      24: 'Road narrows on the right',
      25: 'Road work',
      26: 'Traffic signals',
      27: 'Pedestrians',
      28: 'Children crossing',
      29: 'Bicycles crossing',
      30: 'Beware of ice/snow',
      31: 'Wild animals crossing',
      32: 'End of all speed and passing limits',
      33: 'Turn right ahead',
      34: 'Turn left ahead',
      35: 'Ahead only',
      36: 'Go straight or right',
      37: 'Go straight or left',
      38: 'Keep right',
      39: 'Keep left',
      40: 'Roundabout mandatory',
      41: 'End of no passing',
      42: 'End of no passing by vehicles over 3.5 metric tons'
    }
  }
}
module.exports = { Labels }

// images: [
//   {
//     imageId: 0,
//     misclassified: 'True',
//     originImages: 'http://59.78.194.23:9090/winr/origin-image/fashion_mnist_cnn_4layer_5_3_sigmoid_myself_0.02_20210801_133754_original_image_1_original_label_2.png?verifyId=uwery134r132',
//     originLabel: 'Pullover',
//     robust: 'False',
//     time_sum: '1.2616791725158691',
//     unknown: 'False',
//     unrobust: 'False'
//   },
//   {
//     advExamples: 'http://59.78.194.23:9090/winr/adv_image/fashion_mnist_cnn_4layer_5_3_sigmoid_myself_0.02_20210801_133754_adv_image_0_adv_label_7.png?verifyId=uwery134r132',
//     advLabel: 'Sneaker',
//     eps: '0.02',
//     imageId: 1,
//     misclassified: 'False',
//     originImages: 'http://59.78.194.23:9090/winr/origin-image/fashion_mnist_cnn_4layer_5_3_sigmoid_myself_0.02_20210801_133754_original_image_0_original_label_9.png?verifyId=uwery134r132',
//     originLabel: 'Ankle boot',
//     robust: 'False',
//     time_sum: '0.25118112564086914',
//     unknown: 'False',
//     unrobust: 'True'
//   },
//   {
//     imageId: 2,
//     misclassified: 'False',
//     originImages: 'http://59.78.194.23:9090/winr/origin-image/fashion_mnist_cnn_4layer_5_3_sigmoid_myself_0.02_20210801_133754_original_image_1_original_label_2.png?verifyId=uwery134r132',
//     originLabel: 'Pullover',
//     robust: 'True',
//     time_sum: '1.2616791725158691',
//     unknown: 'False',
//     unrobust: 'False'
//   }
// ]
