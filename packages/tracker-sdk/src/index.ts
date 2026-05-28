function countInstances(value: any, _context: any) {
  let instanceCount = 0

  return class extends value {
    count: number

    constructor(...args: any[]) {
      super(...args)
      instanceCount++
      this.count = instanceCount
    }
  }
}

@countInstances
class MyClass {}

const inst1 = new MyClass() as any
const inst2 = new MyClass() as any
console.log(inst1.count, inst2.count)
