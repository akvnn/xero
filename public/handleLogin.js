const login = async (usernameOremailOrphone, password, type = 'main') => {
  try {
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
    let alertBox = document.getElementById('alertBox2')
    if (type == 'demo') {
      alertBox = document.getElementById('alertBox')
    }
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
    let alertBox = document.getElementById('alertBox2')
    if (alertBox == null) {
      alertBox = document.getElementById('alertBox')
    }
    alertBox.innerText = err
    alertBox.style.backgroundColor = 'red'
    alertBox.style.display = 'block'
    setTimeout(() => {
      alertBox.style.display = 'none'
    }, 3000)
  }
}
window.login = login
