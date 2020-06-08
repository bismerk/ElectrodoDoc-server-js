import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps'
import { getPassword, getLogin } from '../../../support/commands'
import { getCSR } from '../../../support/csr'
import { sha256 } from 'js-sha256'
// import { versions } from '../../../../../src/controllers/FileSystem'

const basic = 'http://localhost:1823/api/v1'
const headers = { 'content-type': 'application/json' }

let user, token, login, email, password, parentFolder, csr, folderData

let getCidFromFile = (fileName, files) => {
  for (let key in files) {
    if (fileName === files[key].name) {
      return files[key].versions[0].cid
    }
  }
}

let getHashFromFile = (fileName, files) => {
  for (let key in files) {
    if (fileName === files[key].name) {
      return files[key].hash
    }
  }
}

before(() => {
  login = getLogin() + 'JWT'
  password = getPassword()
  email = login + '@gmail.com'
  csr = getCSR({ username: login })

  cy.writeFile('cypress/fixtures/privateKey.pem', csr.privateKeyPem)
    .readFile('cypress/fixtures/privateKey.pem')
    .then((text) => {
      expect(text).to.include('-----BEGIN PRIVATE KEY-----')
      expect(text).to.include('-----END PRIVATE KEY-----')
    })
})

/*
  Expect response status:
 */

When(/^Response status 200 view$/, () => {
  expect(200).to.eq(user.status)
})

Then(/^Response status 203 view$/, () => {
  expect(203).to.eq(user.status)
})

Then(/^Response status 404 view$/, () => {
  expect(404).to.eq(user.status)
})

/*
  Implementation of the steps from **.feature
 */

Given(/^Send request for create user for viewing file$/, () => {
  cy.readFile('cypress/fixtures/privateKey.pem').then((key) => {
    cy.request({
      method: 'POST',
      url: `${basic}/user`,
      headers: headers,
      body: {
        'login': login,
        'email': email,
        'password': password,
        'privateKey': key,
        'CSR': csr.csrPem
      },
    }).then((resp) => {
      user = resp
      cy.writeFile('cypress/fixtures/cert.pem', resp.body.cert)
        .then(() => {
          cy.readFile('cypress/fixtures/cert.pem').then((text) => {
            expect(text).to.include('-----BEGIN CERTIFICATE-----')
            expect(text).to.include('-----END CERTIFICATE-----')
          })
        })
    })
  }).fixture('cert.pem').then((cert) => {
    cy.fixture('privateKey.pem').then((key) => {
      cy.request({
        method: 'POST',
        url: `${basic}/user/auth`,
        headers: headers,
        body: {
          'login': login,
          'password': password,
          'certificate': cert,
          'privateKey': key,
        },
      }).then((resp) => {
        token = resp.body.token
        user = resp
        parentFolder = resp.body.folder
      })
    })
  })
})

When(/^The user send request for upload file$/, () => {
  cy.readFile('cypress/fixtures/mockTest.txt').then((str) => {
    let blob = new Blob([str], { type: 'text/plain' })
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`
    })
    let formData = new FormData()
    formData.append('name', 'mockTest')
    formData.append('parentFolder', parentFolder)
    formData.append('file', blob)

    fetch(`${basic}/file`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    }).then((response) => {
      console.log(response.status)
      user = response
      return Promise.resolve(response)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      expect(login).to.equal(data.folder.name)
      folderData = data
      // console.log(data)
    })
  }).as('Send txt').wait(5000)
})

When(/^User sends a request for a file from the root folder$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let cid = getCidFromFile('mockTest', files)
  let hash = getHashFromFile('mockTest', files)

  headers.Authorization = `Bearer ${token}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/${hash}/${cid}`
  }).then((resp) => {
    user = resp
    expect(resp.body.name).to.equal('mockTest')
    expect(resp.body.file).to.equal('Hello, world!')
  })
})

When(/^User sends a request for a file from the root folder without auth$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let cid = getCidFromFile('mockTest', files)
  let hash = getHashFromFile('mockTest', files)

  cy.request({
    method: 'GET',
    url: `${basic}/file/${hash}/${cid}`
  }).then((resp) => {
    user = resp
  })
});

When(/^User sends a request for a file from the root folder with empty auth$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let cid = getCidFromFile('mockTest', files)
  let hash = getHashFromFile('mockTest', files)

  headers.Authorization = 'Bearer '
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/${hash}/${cid}`
  }).then((resp) => {
    user = resp
  })
});

When(/^User sends a request for a file by incorrect hash$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let cid = getCidFromFile('mockTest', files)

  headers.Authorization = `Bearer ${token}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
});

When(/^User sends a request for a file without hash$/, () => {
  let files = JSON.parse(folderData.folder.files)
  let cid = getCidFromFile('mockTest', files)

  headers.Authorization = `Bearer ${token}`
  cy.request({
    headers: headers,
    method: 'GET',
    url: `${basic}/file/*/${cid}`,
    failOnStatusCode: false
  }).then((resp) => {
    user = resp
  })
});