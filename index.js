const Ajv = require('ajv')

// Super types
Ajv.prototype.superTypes = {
  date: { format: 'date'},
  time: { format: 'time'},
  'date-time': { format: 'date-time'},
  uri: { format: 'uri'},
  url: { format: 'uri'},
  email: { format: 'email' },
  hostname: { format: 'hostname'},
  ip: { format: 'ipv4'},
  ipv4: { format: 'ipv4'},
  ipv6: { format: 'ipv6'},
  regex: { format: 'regex'},
  uuid: { format: 'uuid'},
  'json-pointer': { format: 'json-pointer'},
  'relative-json-pointer': {
    format: 'relative-json-pointer' },
}

// Add a super type to AJV
Ajv.prototype.addType = function (name, opt) {
  // Add the super type keyword to AJV
  this.addKeyword('type_' + name, opt)

  // Register type to convert to correct key name for AJV
  this.superTypes[name] = {}
  this.superTypes[name]['type_' + name] = true

  // Return this to pipe functions
  return this
}

// TODO hierarchy search
Ajv.prototype.getSuperSchema = function (originalSchema) {
  if (typeof originalSchema !== 'object') {
    return originalSchema
  }

  // BUG not working... schema chages originalSchema object
  // const schema = Object.assign({}, originalSchema)
  // const schema = Object.create(originalSchema)

  // Too bad for cloning objects... =/
  const schema = JSON.parse(JSON.stringify(originalSchema))

  const props = schema.properties

  // Create required array property
  if (!schema.required) {
    schema.required = []
  }

  // Search for super type entries
  for (let key of Object.keys(props)) {
    // Convert string settings into object
    if (typeof props[key] === 'string') {
      props[key] = {
        type: props[key]
      }
    }

    // Check if the property is a super type
    if (this.superTypes[props[key].type]) {
      // Extends the prop attributes
      Object.assign(
        props[key],
        this.superTypes[props[key].type],
        { type: 'string' })
    }

    // Check super required property
    if (props[key].required && props[key].required === true) {
      if (!schema.required.includes(key)) {
        schema.required.push(key)
      }
      delete props[key].required
    }

    // Setup own properties
    if (props[key].properties) {
      props[key] = this.getSuperSchema(props[key])
    }

    // Check if the property is a super required
    if (key.charAt(0) === '*') {
      const _key = key.substring(1)
      if (!schema.required.includes(_key)) {
        schema.required.push(_key)
      }
      props[_key] = props[key]
      delete props[key]
    }
  }

  return schema
}

// Save default validate functions to convert super types
Ajv.prototype._super_validate = Ajv.prototype.validate

// Redefine validate functions
Ajv.prototype.validate = function (schema, data) {
  return this._super_validate(this.getSuperSchema(schema), data)
}

module.exports = Ajv
