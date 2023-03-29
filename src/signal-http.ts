if (process.env.NODE_ENV === 'production') {
  import('signal-http')
} else {
  // @ts-ignore
  import('../../signal-http') // For live reloading in development
}
