document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.role-btn');
  const hidden = document.getElementById('register-role');
  if (!buttons || !hidden) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role || 'student';
      hidden.value = role;
    });
  });
});
