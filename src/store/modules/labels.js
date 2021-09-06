/*
* Labels of Dataset cifar10, fashion_mnist, gtsrb in Chinese
* ZZW 2021.8.5 14:11
* */
const cifar10LabelOpt = [
  { label: '飞机', value: 0 },
  { label: '摩托车', value: 1 },
  { label: '鸟', value: 2 },
  { label: '猫', value: 3 },
  { label: '鹿', value: 4 },
  { label: '狗', value: 5 },
  { label: '青蛙', value: 6 },
  { label: '马', value: 7 },
  { label: '船', value: 8 },
  { label: '卡车', value: 9 }
]
const fashion_mnistLabelOpt = [
  { label: 'T恤衫', value: 0 },
  { label: '裤子', value: 1 },
  { label: '套衫', value: 2 },
  { label: '裙子', value: 3 },
  { label: '外套', value: 4 },
  { label: '凉鞋', value: 5 },
  { label: '衬衫', value: 6 },
  { label: '运动鞋', value: 7 },
  { label: '双肩包', value: 8 },
  { label: '短靴', value: 9 }
]
const gtsrbLabelOpt = [
  { label: '限速20km/h', value: 0 },
  { label: '限速30km/h', value: 1 },
  { label: '限速50km/h', value: 2 },
  { label: '限速60km/h', value: 3 },
  { label: '限速70km/h', value: 4 },
  { label: '限速80km/h', value: 5 },
  { label: '限速80km/h结束', value: 6 },
  { label: '限速100km/h', value: 7 },
  { label: '限速120km/h', value: 8 },
  { label: '禁止通行', value: 9 },
  { label: '3.5公吨以上车辆不得通行', value: 10 },
  { label: '下个路口通行权', value: 11 },
  { label: '优先级公路', value: 12 },
  { label: '让行', value: 13 },
  { label: '停车', value: 14 },
  { label: '禁止驶入', value: 15 },
  { label: '3.5公吨以上车辆禁止驶入', value: 16 },
  { label: '禁止入内', value: 17 },
  { label: 'General caution', value: 18 },
  { label: 'Dangerous curve to the left', value: 19 },
  { label: 'Dangerous curve to the right', value: 20 },
  { label: 'Double curve', value: 21 },
  { label: '道路不平', value: 22 },
  { label: '路滑', value: 23 },
  { label: '右侧道路变窄', value: 24 },
  { label: '道路施工', value: 25 },
  { label: '交通信号灯', value: 26 },
  { label: '行人', value: 27 },
  { label: '儿童通过', value: 28 },
  { label: '自行车通过', value: 29 },
  { label: '当心冰雪', value: 30 },
  { label: '野生动物通过', value: 31 },
  { label: '限速结束', value: 32 },
  { label: '前方右转', value: 33 },
  { label: '前方左转', value: 34 },
  { label: '只能直行', value: 35 },
  { label: '直行或右转', value: 36 },
  { label: '直行或左转', value: 37 },
  { label: '靠右/不准左转', value: 38 },
  { label: '靠左/不准右转', value: 39 },
  { label: 'Roundabout mandatory', value: 40 },
  { label: '禁止通行结束', value: 41 },
  { label: '3.5公吨以上车辆不得通行结束', value: 42 }
]
const numberPicLabelOpt = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 }
]
export default {
  cifar10LabelOpt,
  fashion_mnistLabelOpt,
  gtsrbLabelOpt,
  numberPicLabelOpt
}
