# Super AJV

[AJV validator](https://github.com/epoberezkin/ajv) with super powers! See also the [AJV full documentation](https://github.com/epoberezkin/ajv).

## Contents

- [Custom types](#custom-types)
- [Required properties](#required-properties)
- [Simplifyed types](#simplifyed-types)

## Custom Types

You can set the types you want!

```javascript
const ajv = new Ajv()

ajv.addType('mongoid', {
  compile () {
    return function (data) {
      const re = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
      return re.test(data)
    }
  }
})

const schema = {
  properties: {
    user_id: { type: 'mongoid' }
  }
}
```

## Required properties

You can set required property in line:

```javascript
const schema = {
  properties: {
    user_id: { type: 'mongoid', required: true }
  }
}
```

And can also set a required property using the '*':

```javascript
const schema = {
  properties: {
    '*user_id': { type: 'mongoid' }
  }
}
```

## Simplifyed types

```javascript
const schema = {
  properties: {
    '*name': 'string',
    '*email': 'email',
    'age': 'number',
    '*message': 'string',
  }
}
```

# Test

```
node test/
```

# License

[GNU](https://github.com/webarthur/super-ajv/blob/master/LICENSE)

> "Simplicity is the ultimate sophistication" <br>
> Da Vinci
