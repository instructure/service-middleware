1. While creating your store, register your services as key/value pairs
   with the middleware:

```
  applyMiddleware(
    serviceMiddleware({ myKey: myService, myOtherKey: myOtherService })
  )
```

2. In your action creator, dispatch an action with the following shape:

```
  {
    type: serviceMiddleware.CALL_SERVICE
    payload: {
      service: 'myKey'
      method: 'methodName'
      args: [arg1, arg2]
    }
  }
```

Subsequent calls to `dispatch` with your action creator will return the
result of calling `myService.methodName(arg1, arg2)`
