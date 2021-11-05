import debug from 'debug'

class ServerError extends Error {
  constructor(props) {
    super(props)
    this.name = props.name
    this.err = props.err
    this.ns = 'server:error'
  }

  logDetail() {
    console.log('need to go herer ? ')
    debug.log(this.ns, this.name, JSON.stringify(this.err))
  }
}

export default ServerError
