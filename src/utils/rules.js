import * as yup from 'yup'

export const schemaLogin = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
})
function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    message: msg || 'Không trùng mật khẩu',
    params: {
      reference: ref.path
    },
    test: function (value) {
      return value === this.resolve(ref)
    }
  })
}

yup.addMethod(yup.string, 'equalTo', equalTo)

export const schemaSignup = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(5, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  avatar: yup.mixed().required('Cần ảnh đại diện'),
  phone_number: yup.string().required('SĐT là bắt buộc').matches(/^\d+$/, 'SĐT không hợp lệ'),
  confirm_password: yup.string().equalTo(yup.ref('password'))
})

export const schemaEditUserProfile = yup.object({
  phone_number: yup.string().matches(/^\d+$/, 'SĐT không hợp lệ')
})

export const schemaRestaurantProfile = yup.object({
  name: yup.string().required('Tên nhà hàng là bắt buộc'),
  images: yup.mixed().test('required', 'Phải có chính xác 5 ảnh', (files) => files.length === 5),
  morning_hour_close: yup.number().when('morning_hour_open', (morning_hour_open, schema) => {
    return schema.min(morning_hour_open, 'Giờ giấc phải hợp lý')
  }),
  morning_hour_open: yup.number(),
  morning_minute_close: yup
    .number()
    .when(
      ['morning_hour_open', 'morning_hour_close', 'morning_minute_open'],
      ([morning_hour_open, morning_hour_close, morning_minute_open], schema) => {
        if (morning_hour_open === morning_hour_close)
          return schema.min(morning_minute_open + 1, 'Giờ giấc phải hợp lý')
      }
    ),
  afternoon_hour_close: yup.number().when('afternoon_hour_open', (afternoon_hour_open, schema) => {
    return schema.min(afternoon_hour_open, 'Giờ giấc phải hợp lý')
  }),
  afternoon_hour_open: yup.number(),
  afternoon_minute_close: yup
    .number()
    .when(
      ['afternoon_hour_open', 'afternoon_hour_close', 'afternoon_minute_open'],
      ([afternoon_hour_open, afternoon_hour_close, afternoon_minute_open], schema) => {
        if (afternoon_hour_open === afternoon_hour_close)
          return schema.min(afternoon_minute_open + 1, 'Giờ giấc phải hợp lý')
      }
    ),
  desc: yup.string().required('Hãy giới thiệu 1 chút gì đó'),
  category: yup.string().required('Hãy liệt kê một số loại nhà hàng')
})

export const schemaFood = yup.object({
  name: yup.string().required('Phải đặt tên món ăn'),
  quantity: yup.string().required('Phải nhập số lượng'),
  desc: yup.string().required('Hãy giới thiệu gì đó về món này'),
  price: yup.string().required('Phải nhập giá'),
  image: yup.mixed().required('Cần ảnh minh hoạ')
})

export const orderInputSchema = yup.object({
  quantity: yup.string().required(' ')
})

export const reviewSchema = yup.object({
  comment: yup.string().required('Bình luận không được trống')
})
