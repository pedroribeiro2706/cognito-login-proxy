const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Captura todos os GETs iniciando com /login
app.get(/^\/login/, (req, res) => {
  const queryParams = req.originalUrl.split('?')[1];
  if (!queryParams) return res.status(400).send('❌ Falta parâmetros.');
  const cognitoBase = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com';
  const redirectUrl = `${cognitoBase}/login?lang=pt-BR&${queryParams}`;
  console.log('🔁 GET ->', redirectUrl);
  return res.redirect(302, redirectUrl);
});

// Captura POSTs para /login/oauth2/token e repassa ao Cognito
app.post('/login/oauth2/token', express.urlencoded({ extended: true }), (req, res) => {
  const url = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/login/oauth2/token';
  console.log('🔁 POST -> Proxy token request to Cognito');

  const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(req.body)
  })
    .then(r => r.text().then(text => {
      res.status(r.status).set(Object.fromEntries(r.headers.entries())).send(text);
    }))
    .catch(err => {
      console.error('❗ Proxy token error: ', err);
      res.status(500).send('Proxy error');
    });
});

//app.listen(port, () => console.log(`✅ Proxy público ouvindo na porta ${port}`));

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Proxy ouvindo em http://0.0.0.0:${port}`);
});
