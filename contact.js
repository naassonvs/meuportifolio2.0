/* ── EmailJS Config ──────────────────────────────────────────
   INSTRUÇÕES:
   1. Crie conta em https://emailjs.com (gratuito)
   2. Crie um Email Service (Gmail) → copie o Service ID
   3. Crie um Email Template → copie o Template ID
   4. Vá em Account → copie a Public Key
   5. Substitua os valores abaixo
   ──────────────────────────────────────────────────────────── */

const EMAILJS_PUBLIC_KEY  = 'SUA_PUBLIC_KEY_AQUI';
const EMAILJS_SERVICE_ID  = 'SUA_SERVICE_ID_AQUI';
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI';

document.addEventListener('DOMContentLoaded', function () {

  // Inicializa EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // ── Type Selector ───────────────────────────────────────
  const typeBtns   = document.querySelectorAll('.type-btn');
  const subjectInput = document.getElementById('subject');

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      subjectInput.value = btn.getAttribute('data-subject');
    });
  });

  // ── Form Submit ─────────────────────────────────────────
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');
  const btnIcon    = document.getElementById('btnIcon');
  const feedback   = document.getElementById('formFeedback');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validação de tipo de contato
    const selectedType = document.querySelector('.type-btn.selected');
    if (!selectedType) {
      showFeedback('error', 'Selecione um tipo de contato antes de enviar.');
      return;
    }

    // Validação básica dos campos
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    let valid = true;
    [name, email, message].forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      showFeedback('error', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Estado de loading
    setLoading(true);
    hideFeedback();

    const templateParams = {
      from_name:    name.value.trim(),
      from_email:   email.value.trim(),
      subject:      subjectInput.value,
      message:      message.value.trim(),
      contact_type: selectedType.getAttribute('data-subject'),
    };

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'SUA_PUBLIC_KEY_AQUI') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      } else {
        // Modo demo: simula envio quando EmailJS ainda não está configurado
        await new Promise(r => setTimeout(r, 1200));
      }

      showFeedback('success', '✅ Mensagem enviada! Entrarei em contato em breve.');
      form.reset();
      typeBtns.forEach(b => b.classList.remove('selected'));
      subjectInput.value = '';

    } catch (err) {
      console.error('EmailJS error:', err);
      showFeedback('error', '❌ Erro ao enviar. Tente pelo WhatsApp ou e-mail diretamente.');
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ─────────────────────────────────────────────
  function setLoading(state) {
    submitBtn.disabled = state;
    btnText.textContent = state ? 'Enviando...' : 'Enviar mensagem';
    btnIcon.textContent = state ? '⏳' : '→';
  }

  function showFeedback(type, msg) {
    feedback.className = 'form-feedback ' + type;
    feedback.textContent = msg;
  }

  function hideFeedback() {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }

  // Remove classe de erro ao digitar
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

});
