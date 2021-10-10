let clients = new Map()

export function registerClient(socket, payload = {}) {
  // sockets should own their unique id, so i may not be care about it.
  // the payload should be extra info data about the socket: user info, bidding info, ...
  clients.set(socket.id, payload)
}

export function deregisterClient(socket) {
  clients.delete(socket.id)
}

export function getAllClients() {
  return clients.keys()
}

export function cleanUp() {
  clients = new Map()
}
