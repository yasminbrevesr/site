(function () {
  'use strict';

  var APP_ID = '1027381520096630';
  var CONFIG_ID = '1831835294656760';
  var API_VERSION = 'v26.0';
  var CALLBACK_ENDPOINT = '/api/whatsapp/meta/callback';
  var BACKEND_CALLBACK_ENABLED = false;
  var DEVELOPMENT = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  var button = document.querySelector('[data-connect-button]');
  var buttonLabel = document.querySelector('[data-connect-label]');
  var statusBox = document.querySelector('[data-connect-status]');
  var statusMessage = document.querySelector('[data-connect-message]');
  var sdkReady = false;
  var flowActive = false;
  var sdkTimer = null;
  var completionTimer = null;

  /* Dados temporários da sessão. Permanecem somente em memória. */
  var signupSession = {
    authorizationCode: null,
    completed: false,
    identifiers: {}
  };

  function isTrustedMetaOrigin(origin) {
    try {
      var url = new URL(origin);
      return url.protocol === 'https:' &&
        (url.hostname === 'facebook.com' || url.hostname.endsWith('.facebook.com'));
    } catch (error) {
      return false;
    }
  }

  function parseMessageData(value) {
    if (value && typeof value === 'object') return value;
    if (typeof value !== 'string') return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  function setButtonState(state) {
    var loading = state === 'loading';
    var success = state === 'success';

    button.dataset.state = state;
    button.disabled = !sdkReady || loading || success;
    button.setAttribute('aria-busy', loading ? 'true' : 'false');

    if (success) buttonLabel.textContent = 'WhatsApp Business conectado';
    else if (loading) buttonLabel.textContent = 'Conectando...';
    else if (state === 'error') buttonLabel.textContent = 'Tentar novamente';
    else buttonLabel.textContent = 'Conectar WhatsApp Business';
  }

  function setStatus(state, message) {
    statusBox.dataset.connectStatus = state;
    statusMessage.textContent = message;
    setButtonState(state);
  }

  function clearSession() {
    signupSession.authorizationCode = null;
    signupSession.completed = false;
    signupSession.identifiers = {};
    clearTimeout(completionTimer);
  }

  function captureIdentifiers(payload) {
    if (!payload || typeof payload !== 'object') return;

    Object.keys(payload).forEach(function (key) {
      if (!/_ids?$/i.test(key)) return;

      var value = payload[key];
      if (typeof value === 'string' || typeof value === 'number') {
        signupSession.identifiers[key] = String(value);
        return;
      }

      if (!Array.isArray(value)) return;
      signupSession.identifiers[key] = value
        .filter(function (value) {
          return typeof value === 'string' || typeof value === 'number';
        })
        .map(String);
    });
  }

  function logDevelopmentEvent(data) {
    if (!DEVELOPMENT || !window.console) return;
    console.info('[BREVES WhatsApp] Embedded Signup', {
      type: data.type,
      event: data.event,
      identifiers: Object.assign({}, signupSession.identifiers)
    });
  }

  /*
   * Ponto de integração para quando o backend real estiver disponível.
   * A função só poderá ser ativada depois que o endpoint seguro existir.
   * A troca do authorization code por token deve acontecer exclusivamente lá.
   */
  async function sendSessionToSecureBackend() {
    var ids = signupSession.identifiers;
    var response = await fetch(CALLBACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        code: signupSession.authorizationCode,
        identifiers: Object.assign({}, ids),
        waba_id: ids.waba_id || null,
        phone_number_id: ids.phone_number_id || null,
        business_id: ids.business_id || null,
        business_manager_id: ids.business_manager_id || null,
        whatsapp_business_account_id: ids.whatsapp_business_account_id || null,
        page_ids: ids.page_ids || [],
        ad_account_ids: ids.ad_account_ids || [],
        catalog_ids: ids.catalog_ids || [],
        dataset_ids: ids.dataset_ids || [],
        instagram_account_ids: ids.instagram_account_ids || []
      })
    });

    if (!response.ok) throw new Error('Falha ao concluir a conexão no servidor.');
  }

  function maybeSendSessionToBackend() {
    if (!BACKEND_CALLBACK_ENABLED ||
        !signupSession.completed ||
        !signupSession.authorizationCode) return;

    sendSessionToSecureBackend().catch(function () {
      setStatus('error', 'Erro ao conectar.');
    });
  }

  function handleEmbeddedSignupMessage(event) {
    if (!isTrustedMetaOrigin(event.origin)) return;

    var data = parseMessageData(event.data);
    if (!data || data.type !== 'WA_EMBEDDED_SIGNUP') return;

    captureIdentifiers(data.data);
    logDevelopmentEvent(data);

    if (data.event === 'FINISH' ||
        data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') {
      signupSession.completed = true;
      flowActive = false;
      clearTimeout(completionTimer);
      setStatus('success', 'WhatsApp Business conectado com sucesso.');
      maybeSendSessionToBackend();
      return;
    }

    if (data.event === 'CANCEL') {
      flowActive = false;
      clearTimeout(completionTimer);
      setStatus('cancelled', 'Conexão cancelada.');
      return;
    }

    if (data.event === 'ERROR') {
      flowActive = false;
      clearTimeout(completionTimer);
      setStatus('error', 'Erro ao conectar.');
    }
  }

  function facebookLoginCallback(response) {
    var code = response && response.authResponse && response.authResponse.code;

    if (code) {
      signupSession.authorizationCode = code;
      if (!signupSession.completed) {
        setStatus('loading', 'Autorização recebida.');
        completionTimer = setTimeout(function () {
          if (!signupSession.completed) {
            flowActive = false;
            setStatus('error', 'Erro ao conectar.');
          }
        }, 30000);
      }
      maybeSendSessionToBackend();
      return;
    }

    if (!signupSession.completed && flowActive) {
      flowActive = false;
      setStatus('cancelled', 'Conexão cancelada.');
    }
  }

  function launchEmbeddedSignup() {
    if (!sdkReady || !window.FB || flowActive) return;

    clearSession();
    flowActive = true;
    setStatus('loading', 'Abrindo Meta...');

    try {
      window.FB.login(facebookLoginCallback, {
        config_id: CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: 'whatsapp_business_app_onboarding',
          sessionInfoVersion: '3'
        }
      });
    } catch (error) {
      flowActive = false;
      setStatus('error', 'Erro ao conectar.');
    }
  }

  function loadFacebookSdk() {
    sdkTimer = setTimeout(function () {
      if (!sdkReady) setStatus('error', 'Erro ao conectar.');
    }, 15000);

    window.fbAsyncInit = function () {
      if (!window.FB) {
        setStatus('error', 'Erro ao conectar.');
        return;
      }

      window.FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: API_VERSION
      });

      clearTimeout(sdkTimer);
      sdkReady = true;
      setStatus('idle', 'Pronto para conectar.');
    };

    if (document.getElementById('facebook-jssdk')) return;

    var script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = function () {
      clearTimeout(sdkTimer);
      setStatus('error', 'Erro ao conectar.');
    };
    document.head.appendChild(script);
  }

  window.addEventListener('message', handleEmbeddedSignupMessage);
  window.addEventListener('pagehide', function () {
    signupSession.authorizationCode = null;
    clearTimeout(completionTimer);
  });
  button.addEventListener('click', launchEmbeddedSignup);
  loadFacebookSdk();
})();
