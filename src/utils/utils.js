import axios from 'axios'
import HttpStatusCode from '../constants/httpStatusCode.enum'
export function isAxiosError(error) {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function getAges(dateOB) {
  const date = new Date(dateOB)
  const currentDate = new Date()
  const year = date.getFullYear()
  const currentYear = currentDate.getFullYear()

  return currentYear - year
}

export function displayNum(num) {
  return num
    .toString()
    .replace(/\D/g, '')
    .replace(/^0+(\d)/, '$1')
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
}

export function convertTime(num) {
  let temp = num
  if (typeof num === 'string') temp = parseInt(num)
  if (temp >= 0 && temp < 10) return '0' + temp
  return temp
}

export function convertDate(date) {
  return date.substring(0, 10).replaceAll('-', '/')
}

export function getStatusRestaurantFromTime(
  morningOpen,
  morningClosed,
  afternoonOpen,
  afternoonClosed
) {
  const date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()
  if (hour < 12) {
    if (
      (hour > parseInt(morningOpen.split(':')[0]) ||
        (hour === parseInt(morningOpen.split(':')[0]) &&
          minute >= parseInt(morningOpen.split(':')[1]))) &&
      (hour < parseInt(morningClosed.split(':')[0]) ||
        (hour === parseInt(morningClosed.split(':')[0]) &&
          minute < parseInt(morningClosed.split(':')[1])))
    )
      return 'Đang hoạt động'
    else return 'Đã đóng cửa'
  } else if (
    (hour > parseInt(afternoonOpen.split(':')[0]) ||
      (hour === parseInt(afternoonOpen.split(':')[0]) &&
        minute >= parseInt(afternoonOpen.split(':')[1]))) &&
    (hour < parseInt(afternoonClosed.split(':')[0]) ||
      (hour === parseInt(afternoonClosed.split(':')[0]) &&
        minute < parseInt(afternoonClosed.split(':')[1])))
  )
    return 'Đang hoạt động'
  else return 'Đã đóng cửa'
}

export function VNDate(dateData) {
  const date = new Date(new Date(dateData) - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
  const temp = new Date(date)
  var weekDay = {
    0: 'Chủ nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7'
  }[temp.getDay()]
  const hour = temp.getHours()
  const when = hour < 11 ? 'sáng' : hour < 13 ? 'trưa' : hour < 18 ? 'chiều' : 'tối'
  const newHour = hour < 13 ? hour : hour - 12
  return (
    newHour +
    ':' +
    temp.getMinutes() +
    ' ' +
    when +
    ', ' +
    weekDay +
    ', ' +
    temp.getDate() +
    '/' +
    temp.getMonth() +
    '/' +
    temp.getFullYear()
  )
}
