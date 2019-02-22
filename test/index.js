const Ajv = require('../index.js')

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  useDefaults: true,
  jsonPointers: true
})

ajv.addType('mongoid', {
  compile: function () {
    return function (data) {
      const re = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
      return re.test(data)
    }
  }
})

const schema = {
  properties: {
    'user_id': 'mongoid',
    '*name': 'string',
    'from': 'email',
    'to': { type: 'email', required: true },
    'subject': 'string',
    'header': {
      type: 'object',
      properties: {
        contentType: 'string'
      }
    }
  }
}

const validate = ajv.compile(schema)

console.log('Original schema:')
console.log(JSON.stringify(schema, null, 2))
console.log('---')

console.log('Super schema:')
console.log(JSON.stringify(ajv.getSuperSchema(schema), null, 2))
console.log('---')

const valid = validate({
  header: {
    contentType: 'text/html'
  },
  user_id: '5c4dbc0d54c7fa6e1299af56',
  name: 'Arthur Araújo',
  from: 'webarthur@gmail.com',
  to: 'someone@exemple.org'
})

console.log('valid', valid)

if (!valid) {
  console.log(validate.errors)
}
