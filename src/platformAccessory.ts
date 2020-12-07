/* eslint-disable no-console */
/* eslint-disable max-len */
import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
//import FakeGatoHistoryService from 'fakegato-history';
import { ExampleHomebridgePlatform } from './platform';
import fakegato from 'fakegato-history';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  private service: Service;
  private humidity: Service;
  
  private FakeGatoHistoryService; 
 
  private historyService: fakegato.FakeGatoHistoryService;

    temperatureVal;
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


 

  

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    
  ) {
    
   
    //Accessory.log = this.log;
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.TemperatureSensor) || this.accessory.addService(this.platform.Service.TemperatureSensor);

    
   
    //this.fakegatoService.addEntry({time: Math.round(new Date().valueOf() / 1000), status: 1});

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.handleCurrentTemperatureGet.bind(this));  

    // register handlers for the Brightness Characteristic
   
    this.humidity = this.accessory.getService('Humidity') ||
      this.accessory.addService(this.platform.Service.HumiditySensor, 'Humidity', 'Hum');

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

    this.humidity.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .on('get', this.handleCurrentRelativeHumidityGet.bind(this));
   
    const historyInterval = 10; // history interval in minutes

    const FakeGatoHistoryService = fakegato(this.platform.api);
    this.historyService = new FakeGatoHistoryService('weather', this.accessory, {
      storage: 'fs',
      //minutes: historyInterval,
    });
    //this.historyService.log = this.platform.log; // swicthed off to prevent flooding the log
    this.historyService.name = accessory.context.device.exampleUniqueId;
    
    console.log(this.historyService.name);
  
     
  
    setInterval(() => {
      this.platform.log.debug('Running interval');
      this.historyService.addEntry({time: Math.round(new Date().valueOf() / 1000),
        temp: this.temperatureVal, pressure: this.pressureVal, humidity: this.humidityVal});
    }, 1000 * 60 * historyInterval);
    
    setInterval(() => {
      // EXAMPLE - inverse the trigger

      this.temperatureVal = Math.random() * 38;
      this.humidityVal = Math.random() * 100;
      this.pressureVal = Math.random() * 1000;

    
   

      this.service.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, this.temperatureVal);
      this.humidity.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, this.humidityVal);
      // this.loggingService.addEntry({time: Math.round(new Date().valueOf() / 1000), temp: 25, pressure: 950, humidity: 44});
     
      this.platform.log.debug('Temp:', this.temperatureVal);
      this.platform.log.debug('Hum:', this.humidityVal);
      this.platform.log.debug('Press:', this.pressureVal);
    }, 30000);
  }

  handleCurrentTemperatureGet(callback) {
    this.platform.log.debug('Triggered GET CurrentTemperature');
    // set this to a valid value for CurrentTemperature
    const currentValue = this.temperatureVal;

    callback(null, currentValue);
  }

  handleCurrentRelativeHumidityGet(callback) {
    this.platform.log.debug('Triggered GET CurrentRelativeHumidity');

    // set this to a valid value for CurrentRelativeHumidity
    const currentValue = this.humidityVal;

    callback(null, currentValue);
  }

}
