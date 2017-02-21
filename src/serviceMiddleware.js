export const CALL_SERVICE = 'inst-redux-service-middleware-CALL_SERVICE'

function serviceMiddleware (services) {
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

export default serviceMiddleware
