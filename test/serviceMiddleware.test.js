import { expect } from 'chai'
import sinon from 'sinon'
import serviceMiddleware, {CALL_SERVICE} from '../src/serviceMiddleware'

describe('serviceMiddleware', function () {
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
      doSomething: sinon.stub().returns('didSomething'),
    }
    middleware = serviceMiddleware({ myService: service })
    store = {}
    next = sinon.stub().returns('didNext')
  })

  const dispatch = (action) => middleware(store)(next)(action)

  it('calls service method for service action', () => {
    const result = dispatch(serviceAction)
    expect(result).to.equal('didSomething')
    expect(next.called).to.be.false
  })

  it('sends store with args', () => {
    const result = dispatch(serviceAction)
    expect(service.doSomething.calledOnce).to.be.true
    expect(service.doSomething.calledWith(1, 2, store)).to.be.true
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
    expect(result).to.equal('didSomething')
    expect(service.doSomething.calledOnce).to.be.true
    expect(service.doSomething.calledWith(store)).to.be.true

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
      const result = dispatch(unrecognizedServiceAction)
      expect.fail('method should have thrown')
    } catch (e) {
      expect(e).to.equal('service yourService undefined')
    }
    expect(next.called).to.be.false
    expect(service.doSomething.called).to.be.false
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
      const result = dispatch(unrecognizedServiceMethodAction)
      expect.fail('method should have thrown')
    } catch (e) {
      expect(e).to.equal('service method doSomethingElse undefined')
    }
    expect(next.called).to.be.false
    expect(service.doSomething.called).to.be.false
  })

  it('calls next for non-service action', () => {
    const nonServiceAction = {
      type: 'other',
      payload: [1, 2]
    }
    const result = dispatch(nonServiceAction)

    expect(result).to.equal('didNext')
    expect(next.calledOnce).to.be.true
    expect(next.calledWith(nonServiceAction)).to.be.true
    expect(service.doSomething.called).to.be.false
  })

  it('calls next for thunk action', () => {
    const thunkAction = () => (Promise.resolve())
    const result = dispatch(thunkAction)

    expect(result).to.equal('didNext')
    expect(next.called).to.be.true
    expect(next.calledWith(thunkAction)).to.be.true
    expect(service.doSomething.called).to.be.false
  })
})
