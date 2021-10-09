import debug from 'debug'

class ServerError extends Error {
  constructor(props) {
    super(props)
    this.name = props.name
    this.err = props.err
    this.ns = 'server:error'
  }

  logDetail() {
    debug.log(this.ns, this.name, this.err)
  }
}

export default ServerError
