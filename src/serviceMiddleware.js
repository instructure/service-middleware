export const CALL_SERVICE = Symbol('CALL_SERVICE')

// 1. While creating your store, register your services as middleware:
//     applyMiddleware(..., serviceMiddleware({ myKey: myService, myOtherKey: myOtherService }))
//
// 2. In your action creator, dispatch an action with the following shape:
//     {
//       type: serviceMiddleware.CALL_SERVICE
//       payload: {
//         service: 'myKey'
//         method: 'methodName'
//         args: [arg1, arg2]
//       }
//     }
//    Dispatch will return the result of calling myService.methodName(arg1, arg2)
export default function serviceMiddleware (services) {
  services = Object.assign(Object.create(null), services)
  return (store) => next => action => {
    if (action.type === CALL_SERVICE) {
      const { service, method, args } = action.payload
      const serviceObject = services[service]
      if (!serviceObject) {
        throw `service ${service} undefined`
      }
      if (!serviceObject[method]) {
        throw `service method ${method} undefined`
      }
      const realArgs = args ? args.slice() : []
      realArgs.push(store)
      return serviceObject[method].apply(serviceObject, realArgs)
    }
    return next(action)
  }
}

serviceMiddleware.CALL_SERVICE = CALL_SERVICE
