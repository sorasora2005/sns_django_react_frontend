const axios = require('axios')
const FormData = require('form-data')

const uploadImage = async () => {
  const form = new FormData()
  form.append('name', 'son5')
  const config = {
    headers: {
      ...form.getHeaders(),  // ← ← ← ← ここ!!
    },
  }
  const result = await axios.post('http://localhost:8000/api/user_profile/', form, config)
  console.log(result)
}

uploadImage();