import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { generate } from 'generate-password'
import { getLogin, getPassword } from '../../../support/commands'
import { getCSR } from '../../../support/csr'

const basic = 'api/v1/user'

let user, login, email, password, csr

const headers = {
  'content-type': 'application/json'
}

beforeEach('Get user data', () => {
  login = getLogin()
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })
})

Then(/^response status 201$/, () => {
  expect(201).to.eq(user.status)
})

Then(/^response status 409$/, () => {
  expect(409).to.eq(user.status)
})

Then(/^response status 422$/, () => {
  expect(422).to.eq(user.status)
})

// -----------------------------------------------------------------------------------

Given(/^I send request for "POST" user$/, async () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user without login$/, () => {
  let login = ''
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without password$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': '',
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without csr$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': password,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': ''
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without email$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': '',
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send a request for "POST" user twice$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
  }).request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with login in field email$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': login,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with email in field login$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': email,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 uppercase letters$/, () => {
  let login = generate({
    length: 2,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})
Given(/^I send request for POST user with username that contain 2 lowercase letters$/, () => {
  let login = generate({
    length: 2,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 uppercase letters$/, () => {
  let login = generate({
    length: 20,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 20 lowercase letters$/, () => {
  let login = generate({
    length: 20,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 uppercase letters$/, () => {
  let login = generate({
    length: 3,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 3 lowercase letters$/, () => {
  let login = generate({
    length: 3,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 uppercase letters$/, () => {
  let login = generate({
    length: 19,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 19 lowercase letters$/, () => {
  let login = generate({
    length: 19,
    uppercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only numbers$/, () => {
  let login = generate({
    numbers: true,
    uppercase: false,
    lowercase: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain letters in uppercase, lowercase and number$/, () => {
  let login = generate({
    numbers: true
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
  }).then((resp) => {
    expect(resp.body.cert).to.contain('-----BEGIN CERTIFICATE-----')
    expect(resp.body.cert).to.contain('-----END CERTIFICATE-----')
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 2 words with uppercase and lowercase$/, () => {
  let login = generate({
    length: 5,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login + '  ' + login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only 1 letter$/, () => {
  let login = generate({
    length: 1,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain 21 characters$/, () => {
  let login = generate({
    length: 21,
    symbols: false
  })
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with username that contain only spaces$/, () => {
  let login = '            '
  let csr = getCSR({ username: login })
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with email that contain 2 @@$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': login + '@@gmail.com',
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with password that contain 101 characters$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': generate({
        length: 101,
        numbers: true,
        symbols: true,
      }),
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user with password that contain 100 characters$/, () => {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'password': generate({
        length: 100,
        numbers: true,
        symbols: true,
      }),
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without field password$/, function () {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'email': email,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without field email$/, function () {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'login': login,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})

Given(/^I send request for POST user without field login$/, function () {
  cy.request({
    method: 'POST',
    url: basic,
    headers: headers,
    body: {
      'email': email,
      'password': password,
      'privateKey': csr.privateKeyPem,
      'CSR': csr.csrPem
    },
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
})
