import { io } from 'socket.io-client'

export const socket = io('http://localhost:5000', {
    autoConnect: false,
    transports: ['websocket', 'polling']
})

export const connectSocket = (token) => {
    socket.auth = { token }
    socket.connect()
}

export const disconnectSocket = () => {
    socket.disconnect()
}
