import { test } from 'tap'
import redactSensitiveWords from '../index'

test('Redact sensitive words with "scrict" mode', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }

  const redactedObj = redactSensitiveWords(objToRedact, { mode: 'strict' })

  t.same(redactedObj, {
    password: '[SECRET]',
    pass: 123456,
    secret_key: '[SECRET]',
    card: '[SECRET]',
    passport: '123',
    hello: { nopass: '123', password: '[SECRET]', secret_api: '[SECRET]' }
  }
  )
  t.end()
})

test('Redact sensitive words with "prefix" mode', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }

  const redactedObj = redactSensitiveWords(objToRedact, { mode: 'prefix', customPrefix: ['secret_'] })

  t.same(redactedObj, {
    password: '123456',
    pass: 123456,
    secret_key: '[SECRET]',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '[SECRET]' }
  }
  )
  t.end()
})

test('Redact sensitive words with "prefix" mode and replace number', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }

  const redactedObj = redactSensitiveWords(objToRedact, { mode: 'prefix', customPrefix: ['secret_'], onlyStringReplace: false })

  t.same(redactedObj, {
      password: '123456',
      pass: 123456,
      secret_key: '[SECRET]',
      card: '1234 5678 9012 3456',
      passport: '123',
      hello: { nopass: '123', password: '123', secret_api: '[SECRET]' }
    }
  )
  t.end()
})

test('Redact sensitive words with "prefix" mode with empty customPrefix', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }

  t.throws(() => {
    redactSensitiveWords(objToRedact, { mode: 'prefix' })
  }, 'Custom prefix must be provided when using mode "prefix" and cannot be an empty string')

  t.end()
})

test('Redact sensitive words with custom badWords', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }
  const redactedObj = redactSensitiveWords(objToRedact, { mode: 'strict', badWords: ['passport', 'secret_api'] })

  t.same(redactedObj, {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '[SECRET]',
    hello: { nopass: '123', password: '123', secret_api: '[SECRET]' }
  })
  t.end()
})

test('Redact sensitive words with replace custom word', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }
  const redactedObj = redactSensitiveWords(objToRedact, {
    mode: 'strict',
    replacement: '***',
    badWords: ['passport', 'secret_api', 'pass']
  })

  t.same(redactedObj, {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '***',
    hello: { nopass: '123', password: '123', secret_api: '***' }
  }
  )
  t.end()
})

test('Redact sensitive words with replace number type', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }
  const redactedObj = redactSensitiveWords(objToRedact, {
    mode: 'strict',
    onlyStringReplace: false,
    replacement: '***',
    badWords: ['passport', 'secret_api', 'pass']
  })

  t.same(redactedObj, {
    password: '123456',
    pass: '***',
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '***',
    hello: { nopass: '123', password: '123', secret_api: '***' }
  }
  )
  t.end()
})

test('Redact sensitive words with empty key', (t) => {
  const objToRedact = {
    password: '123456',
    pass: 123456,
    empty: '',
    secret_key: 'abc123',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '123' }
  }
  const redactedObj = redactSensitiveWords(objToRedact, {
    mode: 'prefix',
    customPrefix: ['secret_'],
    onlyStringReplace: false,
    replacement: '***',
    badWords: ['passport', 'secret_api', 'pass']
  })

  t.same(redactedObj, {
    password: '123456',
    pass: 123456,
    empty: '',
    secret_key: '***',
    card: '1234 5678 9012 3456',
    passport: '123',
    hello: { nopass: '123', password: '123', secret_api: '***' }
  })
  t.end()
})
