const SUPABASE_URL = 'https://mubkdnwzscnirfqnhcpu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tBvoqhNTb_Aw-HSLoKblsA_LD2M3Qye';
const ENDPOINT = `${SUPABASE_URL}/rest/v1/contatos_site`;

function optional(value) {
  const normalized = String(value || '').trim();
  return normalized || null;
}

function getPayload(form) {
  const data = new FormData(form);
  return {
    nome: String(data.get('nome') || '').trim(),
    escritorio: optional(data.get('escritorio')),
    tamanho: optional(data.get('tamanho')),
    contato: String(data.get('contato') || '').trim(),
    canal: String(data.get('canal') || '').trim(),
    origem: String(data.get('origem') || '').trim(),
    mensagem: optional(data.get('mensagem')),
    user_agent: navigator.userAgent.slice(0, 500),
    pagina_origem: window.location.href.slice(0, 500),
  };
}

function setFeedback(form, message, state) {
  const feedback = form.querySelector('[data-form-feedback]');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.state = state;
  feedback.style.display = 'block';
}

async function submitContact(payload) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase respondeu com HTTP ${response.status}`);
  }
}

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.setAttribute('aria-hidden', 'true');
  honeypot.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden';
  form.appendChild(honeypot);

  let submitting = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || honeypot.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button?.innerHTML;
    submitting = true;
    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando…';
    }
    setFeedback(form, 'Enviando seus dados com segurança…', 'loading');

    try {
      await submitContact(getPayload(form));
      form.reset();
      setFeedback(form, 'Recebido — retornaremos em até 1 dia útil.', 'success');
      if (button) button.textContent = 'Recebido ✓';
    } catch (error) {
      console.error('Falha ao cadastrar contato:', error);
      setFeedback(form, 'Não foi possível enviar agora. Tente novamente em instantes.', 'error');
      if (button) {
        button.disabled = false;
        button.innerHTML = originalLabel;
      }
      submitting = false;
    }
  });
});
