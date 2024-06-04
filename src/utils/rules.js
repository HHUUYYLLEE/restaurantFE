import * as yup from 'yup'

export const schemaLogin = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
})
export const schemaSignup = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  avatar: yup.mixed().required('Cần ảnh đại diện')
})

export const schemaEditUserProfile = yup.object({
  phone_number: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ')
})

export const schemaRestaurantProfile = yup.object({
  name: yup.string().required('Tên nhà hàng là bắt buộc'),
  images: yup.mixed().test('required', 'Phải có chính xác 5 ảnh', (files) => files.length === 5),
  morning_hour_close: yup.number().when('morning_hour_open', (morning_hour_open, schema) => {
    return schema.min(morning_hour_open, 'giờ giấc phải hợp lý')
  }),
  morning_hour_open: yup.number(),
  morning_minute_close: yup
    .number()
    .when(
      ['morning_hour_open', 'morning_hour_close', 'morning_minute_open'],
      ([morning_hour_open, morning_hour_close, morning_minute_open], schema) => {
        if (morning_hour_open === morning_hour_close) return schema.min(morning_minute_open, 'phút phải hợp lý')
      }
    ),
  afternoon_hour_close: yup.number().when('afternoon_hour_open', (afternoon_hour_open, schema) => {
    return schema.min(afternoon_hour_open, 'giờ giấc phải hợp lý')
  }),
  afternoon_hour_open: yup.number(),
  afternoon_minute_close: yup
    .number()
    .when(
      ['afternoon_hour_open', 'afternoon_hour_close', 'afternoon_minute_open'],
      ([afternoon_hour_open, afternoon_hour_close, afternoon_minute_open], schema) => {
        if (afternoon_hour_open === afternoon_hour_close)
          return schema.min(afternoon_minute_open, 'giờ giấc phải hợp lý')
      }
    ),
  desc: yup.string().required('Hãy mô tả 1 chút gì đó'),
  number_of_tables: yup.string().required('Phải nhập số bàn'),
  number_of_chairs: yup.string().required('Phải nhập số ghế')
})

export const schemaFood = yup.object({
  name: yup.string().required('Phải đặt tên món ăn'),
  quantity: yup.string().required('Phải nhập số lượng'),
  desc: yup.string().required('Hãy mô tả gì đó về món này'),
  price: yup.string().required('Phải nhập giá'),
  image: yup.mixed().required('Cần ảnh minh hoạ')
})
