const signUp = async () => {
  try {
    const fullName = document.getElementById('fullName').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    if (!fullName || !username || !email || !password) {
      throw new Error('Please fill all required data')
    }
    if (password.length < 8) {
      throw new Error('Password must include more than 8 characters')
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email')
    }
    const data = {
      fullName: fullName,
      username: username,
      email: email,
      password: password,
    }
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const dataAfterResponse = await response.json()
    if (dataAfterResponse.status != true) {
      throw new Error(dataAfterResponse.message)
    }
    const alertBox = document.getElementById('alertBox')
    alertBox.innerText = dataAfterResponse.message
    alertBox.style.backgroundColor = 'green'
    alertBox.style.display = 'block'
    setTimeout(() => {
      alertBox.style.display = 'none'
    }, 3000)
    window.location.href = '/login'
  } catch (err) {
    console.error(err)
    const alertBox = document.getElementById('alertBox')
    alertBox.innerText = err
    alertBox.style.backgroundColor = 'red'
    alertBox.style.display = 'block'
    setTimeout(() => {
      alertBox.style.display = 'none'
    }, 3000)
  }
}
const signupbtn = document.getElementById('signupbtn')
signupbtn.addEventListener('click', async (event) => {
  event.preventDefault()
  await signUp()
})

const demologin = document.getElementById('demoLink')
demologin.addEventListener('click', async (event) => {
  event.preventDefault()
  await login('dd', '12345678', 'demo')
})
