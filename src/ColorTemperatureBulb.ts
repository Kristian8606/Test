/* eslint-disable max-len */
import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';

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

    

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .on('set', this.setOn.bind(this))                
      .on('get', this.getOn.bind(this));    

    this.service.getCharacteristic(this.platform.Characteristic.Hue)
      .on('set', this.setHue.bind(this))                
      .on('get', this.getHue.bind(this));  

    this.service.getCharacteristic(this.platform.Characteristic.Saturation)
      .on('set', this.setSaturation.bind(this))                
      .on('get', this.getSaturation.bind(this));  

    
    this.service.getCharacteristic(this.platform.Characteristic.ColorTemperature)
      .on('set', this.setCt.bind(this))                
      .on('get', this.getCt.bind(this));  

    this.service.getCharacteristic(this.platform.Characteristic.SetupTransferTransport)
      .on('set', this.setTransitionControl.bind(this))                
      .on('get', this.getTransitionControl.bind(this));  

    this.service.getCharacteristic(this.platform.Characteristic.SupportedTransferTransportConfiguration)
      .on('get', this.getSCVTC.bind(this));               

      
    this.service.getCharacteristic(this.platform.Characteristic.Brightness)
      .on('set', this.setBrightness.bind(this));      

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

   
    setInterval(() => {
      // EXAMPLE - inverse the trigger

      // push the new value to HomeKit
      // motionSensorOneService.updateCharacteristic(this.platform.Characteristic.MotionDetected, motionDetected);
      // motionSensorTwoService.updateCharacteristic(this.platform.Characteristic.MotionDetected, !motionDetected);

      //this.platform.log.debug('Triggering motionSensorOneService:', motionDetected);
      //this.platform.log.debug('Triggering motionSensorTwoService:', !motionDetected);
    }, 10000);
  }

 
  setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.exampleStates.On = value as boolean;

    this.platform.log.debug('Set Characteristic On ->', value);

    // you must call the callback function
    callback(null);
  }

  setCt(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.exampleStates.ColorTemperature = value as number;

    this.platform.log.debug('Set Characteristic ColorTemperature -> ', value);

    // you must call the callback function
    callback(null);
  }

 
  getSCVTC(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.ColorTemperature;

   

    this.platform.log.debug('Get Characteristic SCVTC -> ', isOn);

    callback(null, isOn);
  }

  getCt(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.ColorTemperature;

   

    this.platform.log.debug('Get Characteristic ColorTemperature -> ', isOn);

    callback(null, isOn);
  }

  setTransitionControl(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.exampleStates.ColorTemperature = value as number;

    this.platform.log.debug('Set Characteristic CharacteristicValueTransitionControl -> ', value);

    // you must call the callback function
    callback(null);
  }

 
  getTransitionControl(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.ColorTemperature;

   

    this.platform.log.debug('Get Characteristic CharacteristicValueTransitionControl -> ', isOn);

    callback(null, isOn);
  }

  setHue(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.exampleStates.Hue = value as number;

    this.platform.log.debug('Set Characteristic Hue -> ', value);

    // you must call the callback function
    callback(null);
  }

 
  getHue(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.Hue;

   

    this.platform.log.debug('Get Characteristic Hue -> ', isOn);

    callback(null, isOn);
  }

  setSaturation(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to turn your device on/off
    this.exampleStates.Sat = value as number;

    this.platform.log.debug('Set Characteristic Sat -> ', value);

    // you must call the callback function
    callback(null);
  }

 
  getSaturation(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.Sat;

   

    this.platform.log.debug('Get Characteristic Sat -> ', isOn);

    callback(null, isOn);
  }

  getOn(callback: CharacteristicGetCallback) {

    // implement your own code to check if the device is on
    const isOn = this.exampleStates.On;

    this.platform.log.debug('Get Characteristic On ->', isOn);

    callback(null, isOn);
  }

 
  setBrightness(value: CharacteristicValue, callback: CharacteristicSetCallback) {

    // implement your own code to set the brightness
    this.exampleStates.Brightness = value as number;

    this.platform.log.debug('Set Characteristic Brightness -> ', value);

    // you must call the callback function
    callback(null);
  }

}