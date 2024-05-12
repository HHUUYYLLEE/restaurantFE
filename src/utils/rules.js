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

export const schemaEditRoom = yup.object({
  name: yup.string().required('Bắt buộc'),
  describe: yup.string().required('Bắt buộc'),
  number_or_people: yup.string().required('Bắt buộc'),
  area: yup.string().required('Bắt buộc'),
  price: yup.string().required('Bắt buộc'),
  address: yup.string().required('Bắt buộc')
})
