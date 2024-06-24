const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')

const uploadImage = async () => {
  const form = new FormData()
  const file = fs.createReadStream('C:\\Users\\sora0\\sns_django_react_frontend\\public\\images\\avatar\\avatar1.png')
  form.append('image', file)
  form.append('name', 'son4')
  const config = {
    headers: {
      ...form.getHeaders(),  // ← ← ← ← ここ!!
    },
  }
  const result = await axios.post('http://localhost:8000/api/user_profile/', form, config)
  console.log(result)
}

uploadImage();