// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle')
const nav = document.getElementById('nav')
menuToggle.addEventListener('click', () => nav.classList.toggle('open'))

// Header shadow on scroll
const header = document.getElementById('header')
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20)
})

// Smooth close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'))
})

// Form submission
const form = document.getElementById('contactForm')
const submitBtn = document.getElementById('submitBtn')
const feedback = document.getElementById('formFeedback')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  }

  // Basic validation
  if (!formData.name || !formData.email || !formData.message) {
    feedback.textContent = '请填写姓名、邮箱和需求描述'
    feedback.className = 'form-feedback error'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    feedback.textContent = '请输入有效的邮箱地址'
    feedback.className = 'form-feedback error'
    return
  }

  submitBtn.disabled = true
  submitBtn.textContent = '提交中...'
  feedback.textContent = ''
  feedback.className = 'form-feedback'

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      feedback.textContent = '提交成功！我们将在 24 小时内与您联系。'
      feedback.className = 'form-feedback success'
      form.reset()
    } else {
      const data = await res.json()
      feedback.textContent = data.error || '提交失败，请稍后重试'
      feedback.className = 'form-feedback error'
    }
  } catch {
    feedback.textContent = '网络错误，请检查网络后重试'
    feedback.className = 'form-feedback error'
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = '提交需求'
  }
})
