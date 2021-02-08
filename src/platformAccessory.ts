/* eslint-disable no-console */
/* eslint-disable max-len */
import { Service, PlatformAccessory } from 'homebridge';
//import FakeGatoHistoryService from 'fakegato-history';
import { ExampleHomebridgePlatform } from './platform';
import fakegato from 'fakegato-history';
//import { Server, ServerResponse } from 'http';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  private service: Service;
  //private humidity: Service;
  
  private FakeGatoHistoryService; 
 
  private historyService: fakegato.FakeGatoHistoryService;

    state;
    humidityVal;
    pressureVal;
   
  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private exampleStates = {
    On: false,
    Brightness: 100,
  };


  net = require('net');
 
 

  

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    
  ) {
    
   
    //Accessory.log = this.log;
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.exampleUniqueId);

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);

    
   
    //this.fakegatoService.addEntry({time: Math.round(new Date().valueOf() / 1000), status: 1});

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .on('get', this.handleOnGet.bind(this))
      .on('set', this.handleOnSet.bind(this));  

    
    // register handlers for the Brightness Characteristic
    /*
    this.humidity = this.accessory.getService('Humidity') ||
      this.accessory.addService(this.platform.Service.HumiditySensor, 'Humidity', 'Hum');
    */
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

    //this.humidity.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
    //.on('get', this.handleCurrentRelativeHumidityGet.bind(this));

    //this.log = this.platform.log;
   
    const historyInterval = 10; // history interval in minutes

    this.FakeGatoHistoryService = fakegato(this.platform.api);
    /*
    this.historyService = new FakeGatoHistoryService('switch', this.accessory, {
      storage: 'fs',
      //minutes: historyInterval,
    });
    */
    //this.historyService.log = this.platform.log; // swicthed off to prevent flooding the log
    /* -------------------------- HISTORY
    this.historyService = new this.FakeGatoHistoryService('switch', this.accessory,
      {storage: 'fs',
        minutes:10});

    this.historyService.name = accessory.context.device.exampleDisplayName;
    this.historyService.accessoryName = accessory.context.device.exampleDisplayName;
    this.historyService.log = this.platform.log;
    this.historyService.SerialNumber = accessory.context.device.exampleUniqueId;

    if(this.historyService.SerialNumber === accessory.context.device.exampleUniqueId){
      this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000), status: this.state});

    }
    *///-----------------------end
    setInterval(() => {
      this.platform.log.debug('Running interval');
      /*
      this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000),
        temp: this.temperatureVal, pressure: this.pressureVal, humidity: this.humidityVal});
       
      this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000),
        temp: this.temperatureVal, pressure: this.pressureVal, humidity: this.humidityVal});
        */ 
      /*
      if(this.historyService.SerialNumber === accessory.context.device.exampleUniqueId){
        this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000), status: this.state});

      }*/
    }, 1000 * 60 * historyInterval);
    
    setInterval(() => {
      // EXAMPLE - inverse the trigger
      /*
      this.state = Math.random() * 1;
      this.humidityVal = Math.random() * 100;
      this.pressureVal = Math.random() * 1000;
      */
    
   

      // this.service.updateCharacteristic(this.platform.Characteristic.On, this.state);
      //this.humidity.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, this.humidityVal);
      // this.loggingService.addEntry({time: Math.round(new Date().valueOf() / 1000), temp: 25, pressure: 950, humidity: 44});
      /*
      this.platform.log.debug('Temp:', this.temperatureVal);
      this.platform.log.debug('Hum:', this.humidityVal);
      this.platform.log.debug('Press:', this.pressureVal);
      */
    }, 30000);

    this.web();
  }

  
  handleOnGet(callback) {
    this.platform.log.debug('Triggered GET On');

    // set this to a valid value for On
    const currentValue = this.state;
    
    callback(null, currentValue);
  }

  /**
   * Handle requests to set the "On" characteristic
   */
  handleOnSet(value, callback) {
    this.platform.log.debug('Triggered SET On:', value);
    this.state = value;
    if(this.historyService.SerialNumber === this.accessory.context.device.exampleUniqueId){
      this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000), status: this.state});

    }

    
    
   
    
   
     
    callback(null);
  }

  web(){
   
     
    // Create a server object
    const server = this.net.createServer((socket) => {
      socket.on('data', (data) => {
        console.log(data.toString());
      });
      socket.write('SERVER: Hello! This is server speaking.<br>');
      socket.end('SERVER: Closing connection now.<br>');
    }).on('error', (err) => {
      console.error(err);
    });
    // Open server on port 9898
    server.listen(9898, () => {
      console.log('opened server on', server.address().port);
    });
  }
  
}
