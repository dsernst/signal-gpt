import { create, all } from 'mathjs'

const math = create(all)
const limitedEvaluate = math.evaluate

// Disabling dangerous features (https://mathjs.org/docs/expressions/security.html)
math.import(
  {
    import: () => {
      throw new Error('Function import is disabled')
    },
    createUnit: () => {
      throw new Error('Function createUnit is disabled')
    },
    evaluate: () => {
      throw new Error('Function evaluate is disabled')
    },
    parse: () => {
      throw new Error('Function parse is disabled')
    },
    simplify: () => {
      throw new Error('Function simplify is disabled')
    },
    derivative: () => {
      throw new Error('Function derivative is disabled')
    },
  },
  { override: true }
)

export default (message: string): string => {
  const mathEquation = message.split('math ')[1]
  try {
    return limitedEvaluate(mathEquation).toString()
  } catch (error) {
    console.log('🔴 /math error:', error)
    return String(error)
  }
}
