// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle')
const nav = document.getElementById('nav')
menuToggle.addEventListener('click', () => nav.classList.toggle('open'))
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'))
})

// Gallery category filter
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'))
    this.classList.add('active')
  })
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
    company: form.company ? form.company.value.trim() : '',
    message: form.message.value.trim(),
  }

  if (!formData.name || !formData.email || !formData.message) {
    feedback.textContent = 'Please fill in name, email and message'
    feedback.className = 'form-feedback error'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    feedback.textContent = 'Please enter a valid email address'
    feedback.className = 'form-feedback error'
    return
  }

  submitBtn.disabled = true
  submitBtn.textContent = 'Submitting...'
  feedback.textContent = ''
  feedback.className = 'form-feedback'

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      window.location.href = '/thanks.html'
      return
    } else {
      const data = await res.json()
      feedback.textContent = data.error || 'Submission failed, please try again'
      feedback.className = 'form-feedback error'
    }
  } catch {
    feedback.textContent = 'Network error, please try again'
    feedback.className = 'form-feedback error'
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Get An Instant Quote →'
  }
})
