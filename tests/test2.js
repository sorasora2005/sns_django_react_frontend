const body = new FormData()
body.append('name', 'value1')
body.append('gender', 'male')
const response = fetch('http://localhost:8000/api/user_profile/', {
  method: 'POST',
  body,
})