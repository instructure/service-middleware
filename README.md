1. While creating your store, register your services as middleware:
    applyMiddleware(..., serviceMiddleware({ myKey: myService, myOtherKey: myOtherService }))

2. In your action creator, dispatch an action with the following shape:
    {
      type: serviceMiddleware.CALL_SERVICE
      payload: {
        service: 'myKey'
        method: 'methodName'
        args: [arg1, arg2]
      }
    }
Dispatch will return the result of calling myService.methodName(arg1, arg2)
