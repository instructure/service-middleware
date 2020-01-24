/* global jest, expect */
import createServiceMiddleware, { CALL_SERVICE } from '../index'

/* eslint-disable no-console */
// clear the console before rebundling:
if (typeof console.clear === 'function') {
  console.clear()
}
/* eslint-enable no-console */

process.once('unhandledRejection', (error) => {
  console.error('Unhandled rejection: ' + error.stack)
  process.exit(1)
})

describe('createServiceMiddleware', () => {
  const serviceAction = {
    type: CALL_SERVICE,
    payload: {
      service: 'myService',
      method: 'doSomething',
      args: [1, 2]
    }
  }

  let service, middleware, store, next
  beforeEach(() => {
    service = {
      doSomething: jest.fn(() => 'didSomething')
    }
    middleware = createServiceMiddleware({ myService: service })
    store = {}
    next = jest.fn(() => 'didNext')
  })

  const dispatch = (action) => middleware(store)(next)(action)

  it('calls service method for service action', () => {
    const result = dispatch(serviceAction)
    expect(result).toBe('didSomething')
    expect(next).toHaveBeenCalled()
  })

  it('sends store with args', () => {
    dispatch(serviceAction)
    expect(service.doSomething.mock.calls.length).toEqual(1)
    expect(service.doSomething).toHaveBeenCalledWith(1, 2, store)
  })

  it('sends store when args null', () => {
    const nullArgsAction = {
      type: CALL_SERVICE,
      payload: {
        service: 'myService',
        method: 'doSomething'
      }
    }
    const result = dispatch(nullArgsAction)
    expect(result).toBe('didSomething')
    expect(service.doSomething.mock.calls.length).toEqual(1)
    expect(service.doSomething).toHaveBeenCalledWith(store)
  })

  it('raises error for unrecognized service', () => {
    const unrecognizedServiceAction = {
      type: CALL_SERVICE,
      payload: {
        service: 'yourService',
        method: 'doSomething',
        args: [1, 2]
      }
    }

    try {
      dispatch(unrecognizedServiceAction)
      expect.fail('method should have thrown')
    } catch (e) {
      expect(e.message).toBe('service yourService undefined')
    }
    expect(next).not.toHaveBeenCalled()
    expect(service.doSomething).not.toHaveBeenCalled()
  })

  it('raises error for unrecognized service method', () => {
    const unrecognizedServiceMethodAction = {
      type: CALL_SERVICE,
      payload: {
        service: 'myService',
        method: 'doSomethingElse',
        args: [1, 2]
      }
    }

    try {
      dispatch(unrecognizedServiceMethodAction)
      expect.fail('method should have thrown')
    } catch (e) {
      expect(e.message).toBe('service method doSomethingElse undefined')
    }
    expect(next).not.toHaveBeenCalled()
    expect(service.doSomething).not.toHaveBeenCalled()
  })

  it('calls next for non-service action', () => {
    const nonServiceAction = {
      type: 'other',
      payload: [1, 2]
    }
    const result = dispatch(nonServiceAction)

    expect(result).toBe('didNext')
    expect(next).toHaveBeenCalledWith(nonServiceAction)
    expect(service.doSomething).not.toHaveBeenCalled()
  })

  it('calls next for thunk action', () => {
    const thunkAction = () => (Promise.resolve())
    const result = dispatch(thunkAction)

    expect(result).toBe('didNext')
    expect(next).toHaveBeenCalledWith(thunkAction)
    expect(service.doSomething).not.toHaveBeenCalled()
  })
})
