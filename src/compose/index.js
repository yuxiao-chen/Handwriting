const compose = (...args) => args.reduce((a, b) => (x) => a(b(x)))

const calc = compose(
    (x) => x * 2,
    (x) => x + 1
)

console.log(calc(2))