import { create, all } from 'mathjs'

// Create a limited version of the mathjs library to avoid possible exploits.
const math = create(all, { number: 'BigNumber', precision: 64 })

// Define a list of allowed functions and operators for extra security.
const allowedFunctions = [
  'add',
  'subtract',
  'multiply',
  'divide',
  'pow',
  'sqrt',
  'abs',
  'ceil',
  'floor',
  'round',
  'exp',
  'log',
  'log10',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'asinh',
  'acosh',
  'atanh',
]

const allowedOperators = ['+', '-', '*', '/', '^', '(', ')', ',', '.']

const hasUnsafeToken = (expression: string): string | void => {
  const tokens = math
    .parse(expression)
    .toString()
    .split(/[\s,]+/)
  for (const token of tokens) {
    if (
      !allowedFunctions.includes(token) &&
      !allowedOperators.includes(token) &&
      isNaN(parseFloat(token))
    ) {
      return token
    }
  }
}

export default (message: string): string => {
  const mathEquation = message.split('math ')[1]
  try {
    const unsafeToken = hasUnsafeToken(mathEquation)
    if (unsafeToken) {
      console.log('🔴 /math unsafe token:', unsafeToken)
      return `Unsafe token: ${unsafeToken}`
    }

    const result = math.evaluate(mathEquation)
    return result.toString()
  } catch (error) {
    console.log('🔴 /math error:', error)
    return 'An error occurred while evaluating the math expression. Please ensure the equation is valid.'
  }
}
