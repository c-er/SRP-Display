# SRP-Display
contains all display and mapping subsystem code

# Client
Uses a template from google material design as the static material - dynamic content is injected through jQuery.
Communicates with server for real-time dynamic content using socket.io
Events emitted:
client_time - asks for data closest to a selected time
client_special - special query (will filter so that destruction/creation of data is impossible)


# Server
NodeJS based - serves static content using ExpressJS. Communicates real-time dynamic content to client using socket.io
Events emitted: 
data_now - emitted to all sockets each time the most recent data in the database changes (database is checked once per second)
data_time - emitted to the socket that asks for the data that is closest to a given time
data_special - emitted to the socket as the response when it asks for a special query
