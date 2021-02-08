/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

class JsonReply extends EventEmitter {

}

class NotificationHandler extends EventEmitter {
   
  constructor(namespace) {
    super();
    this.namespace = namespace;
   
  }

}

class NymeaClient extends EventEmitter {

  constructor(serverAddress, port) {
    super();
    this.address = serverAddress;
    this.port = port;
    this.commandId = 0;
    this.serverUuid = '';
    this.pendingCommands = {};
    this.inputBuffer = '';
    this.token = '';
    this.notificationHandlers = [];
    
  }

  sendCommand(method, params) {
    const commandId = this.commandId++;
    const command = {};
    command['id'] = commandId;
    command['method'] = method;
    command['params'] = params;
    command['token'] = this.token;
    this.client.write(JSON.stringify(command) + '\n');

    const jsonReply = new JsonReply();
    jsonReply.command = command;
    this.pendingCommands[commandId] = jsonReply;
    return jsonReply;
  }

  connect() {
    const option = {
      host: this.address,
      port: this.port,
    };

    console.log('Connecting to nymea on ' + option.host + ':' + option.port); 
    const client = net.createConnection(option, (() => {
      console.log('TCP socket connected. Starting handshake...');
      const helloReply = this.sendCommand('JSONRPC.Hello', {});
      helloReply.on('finished', ((reply) => {
        console.log('Nymea', reply.version, 'initial setup required:', reply.initialSetupRequired, 'authentication required:', reply.authenticationRequired);
        this.serverUuid = reply.uuid;
        if (reply.initialSetupRequired) {
          this.emit('initialSetupRequired');
          return;
        }
        if (reply.authenticationRequired) {
          try {
            const settings = JSON.parse(fs.readFileSync('./config.json'));
           
            this.token = settings[reply.uuid]['token'];
          } catch (exception) {
            // No token in config
            console.log('No token in config');
          }
          if (this.token !== undefined && this.token.length === 0) {
            this.emit('authenticationRequired');
            return;
          }
        }
        this.emit('connected');
      }));
    }));

    client.on('data', ((data) => {
      //        console.log('Server return data : ' + data);

      // On large data, we might not get the full JSON packet at once. Append data to an input buffer
      this.inputBuffer += data;

      // Try splitting the input data in the boundry of 2 json objects
      let splitIndex = this.inputBuffer.indexOf('}\n{') + 1;
      if (splitIndex <= 0) {
        // Of no package broundry detected, assume all the data is one complete packet (it might not be complete yet)
        splitIndex = this.inputBuffer.length;
      }
      let packet;
      // Try to parse the packet...
      try {
        packet = JSON.parse(this.inputBuffer.slice(0, splitIndex));
      } catch(error) {
        // Parsing of JSON failed. Packet is not complete yet...
        //            console.log("incomplete packet", packet, error);
        return;
      }

      // Check if packet is a notification and inform registered handlers
      if (packet.hasOwnProperty('notification')) {
        this.namespace = packet.notification.split('.')[0];
        for (let i = 0; i < this.notificationHandlers.length; i++) {
          const handler = this.notificationHandlers[i];
          handler.emit('notification', packet.notification, packet.params);
        }
      } else {
        // If it's not a notifacation, it's a reply to a request
        const jsonReply = this.pendingCommands[packet.id];
        if (jsonReply) {
          // and emit finished on it
          if (packet.status === 'error') {
            console.warn('Invalid command sent:', jsonReply.command.method);
            console.warn(packet.error);
            console.log('command was:', JSON.stringify(jsonReply.command));
          }

          jsonReply.emit('finished', packet.params);
        } else {
          console.log('Received a reply but can\'t find a pending command');
        }
      }

      // Trim the packet we've just parsed from the input buffer
      this.inputBuffer = this.inputBuffer.slice(splitIndex, this.inputBuffer.length);
      if (this.inputBuffer.length > 0) {
        // Input buffer still has data. Relaunching ourselves with the remaining data.
        client.emit('data', '');
      }

    }));

    client.on('end', (() => {
      console.log('Client socket disconnect. ');
      this.emit('disconnected');
    }));

    client.on('error', (err) => {
      console.error(JSON.stringify(err));
    });

    this.client = client;
  }

  authenticate(username, password, deviceName) {
    const params = {};
    params['username'] = username;
    params['password'] = password;
    params['deviceName'] = deviceName;
    const auth = this.sendCommand('Users.Authenticate', params);
    auth.on('finished', ((reply) => {
      if (!reply.success) {
        console.warn('Authentication failed.');
        this.emit('authenticationRequired');
        return;
      }
      console.log('Authentication successful');
      this.token = reply.token;
      const settings = {};
      settings[this.serverUuid] = {};
      settings[this.serverUuid]['token'] = reply.token;
      fs.writeFile('./config.json', JSON.stringify(settings), (error) => {
        if (error) {
          console.warn('Unable to write config file:', error.message);
        }
      });
      this.emit('connected');
    }));
  }
  
  registerNotificationHandler(namespace) {
    const handler = new NotificationHandler(namespace);
    this.notificationHandlers.push(handler);

   
    const allNamespaces = [] as any;
    for (let i = 0; i < this.notificationHandlers.length; i++) {
      if (allNamespaces.indexOf(this.notificationHandlers[i].namespace) < 0 ) {
        allNamespaces.push(this.notificationHandlers[i].namespace);
      }
    }

    const params = {};
    params['namespaces'] = allNamespaces;
    this.sendCommand('JSONRPC.SetNotificationStatus', params);
    return handler;
  }
  

}


module.exports = NymeaClient;
