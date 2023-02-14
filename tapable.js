import {
  SyncHook,
  AsyncParallelHook,
} from "tapable"

class List {
  getRoutes() { }
}

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]), //同步
      brake: new SyncHook(),//promise 异步
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])// 回调函数 异步
    };
  }
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    //? call 触发事件
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
      // res is undefined for AsyncParallelHook
      console.log('useNavigationSystemPromise');
      return routesList.getRoutes();
    });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
  /* ... */
}

//? 1.注册
const car = new Car()

car.hooks.accelerate.tap('test 1', (speed) => void console.log('accelerate to ' + speed))

car.hooks.calculateRoutes.tapPromise('test 2 promise', (source, target) => new Promise((resolve) => void setTimeout(() => {
  console.log('calculateRoutes tapPromise', source, target)
  resolve()
}, 1000)))
car.hooks.calculateRoutes.tapPromise('test 3 promise', (source, target) => new Promise((resolve) => void setTimeout(() => {
  console.log('calculateRoutes tapPromise', source, target)
  resolve()
}, 2000)))

//? 2.触发
car.setSpeed(60)

car.useNavigationSystemPromise(['1', '2', '3'], 1)
