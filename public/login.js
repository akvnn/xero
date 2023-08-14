const login = async () => {
  try {
    const usernameOremailOrphone = document.getElementById(
      'usernameOremailOrphone'
    ).value
    const password = document.getElementById('passwordLogin').value
    if (!usernameOremailOrphone || !password) {
      throw new Error('Please fill all required data')
    }
    if (password.length < 8) {
      throw new Error('Invalid Information')
    }
    const data = {
      usernameOremailOrphone: usernameOremailOrphone,
      password: password,
    }
    const response = await fetch('/login', {
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
    const alertBox = document.getElementById('alertBox2')
    alertBox.innerText = dataAfterResponse.message
    alertBox.style.backgroundColor = 'green'
    alertBox.style.display = 'block'
    setTimeout(() => {
      alertBox.style.display = 'none'
    }, 3000)
    // cookies
    const expirationDate = 7
    const date = new Date()
    date.setTime(date.getTime() + expirationDate * 24 * 60 * 60 * 1000)
    document.cookie = `token=${
      dataAfterResponse.token
    }; expires=${date.toUTCString()}; path=/`
    // end of cookies
    window.location.href = '/home'
    // localStorage.setItem('token', dataAfterResponse.token)
    // window.location.href = '/home'
  } catch (err) {
    console.error(err)
    const alertBox = document.getElementById('alertBox2')
    alertBox.innerText = err
    alertBox.style.backgroundColor = 'red'
    alertBox.style.display = 'block'
    setTimeout(() => {
      alertBox.style.display = 'none'
    }, 3000)
  }
}

const loginbtn = document.getElementById('loginbtn')
loginbtn.addEventListener('click', async (event) => {
  event.preventDefault()
  await login()
})

const logout = async () => {
  removeCookie('token')
  window.location.href = '/'
}
