export const CALL_SERVICE = 'inst-redux-service-middleware-CALL_SERVICE'

function createServiceMiddleware (services) {
  services = Object.assign(Object.create(null), services)

  return (store) => next => action => {
    if (action.type !== CALL_SERVICE) return next(action)

    const { service: serviceKey, method, args } = action.payload
    const service = services[serviceKey]

    if (!service) throw `service ${serviceKey} undefined`
    if (!service[method]) throw `service method ${method} undefined`

    const realArgs = args ? args.slice() : []
    realArgs.push(store)

    const response = service[method].apply(service, realArgs)
    // Pass on this event after the service has done what the service wants w/ current state
    next(action)
    // Then return the service
    return response
  }
}

export default createServiceMiddleware
