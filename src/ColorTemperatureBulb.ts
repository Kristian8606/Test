/* eslint-disable max-len */
import { Service, PlatformAccessory } from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ColorTemperatureBulbExample {
  private service: Service;
 

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private exampleStates = {
    On: false,
    Brightness: 100,
    Hue: 360,
    Sat: 100,
    ColorTemperature: 155,
    getSCVTCl: 1,
    TransitionControl: 155,
  };

  

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

   
    this.service = this.accessory.getService(this.platform.Service.Lightbulb) || this.accessory.addService(this.platform.Service.Lightbulb);  
    this.service.getCharacteristic(this.platform.Characteristic.On);
    this.service.getCharacteristic(this.platform.Characteristic.Brightness);
    
    this.service.getCharacteristic(this.platform.Characteristic.Hue);
    
    this.service.getCharacteristic(this.platform.Characteristic.Saturation);
    this.service.getCharacteristic(this.platform.Characteristic.ColorTemperature);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

   
  }

 
  

 
 
  


 

 
  

}