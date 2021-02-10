/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs */
import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, CharacteristicGetCallback, PlatformConfig, Service, Characteristic, CharacteristicEventTypes, CharacteristicSetCallback, CharacteristicValue } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
//import { ExamplePlatformAccessory } from './platformAccessory';
import { ColorTemperatureBulbExample } from './ColorTemperatureBulb';
//import WebSocket from 'ws';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */

export class ExampleHomebridgePlatform implements DynamicPlatformPlugin {

	public readonly Service: typeof Service = this.api.hap.Service;
	public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
	private FakeGatoHistoryService;
	// this is used to track restored cached accessories
	public readonly accessories: PlatformAccessory[] = [];
	public readonly handlle: string[] = [];
	data: PlatformAccessory[] = [];



	constructor(
		public readonly log: Logger,
		public readonly config: PlatformConfig,
		public readonly api: API,

	) {

	  this.log.debug('Finished initializing platform:', this.config.name);

	  // When this event is fired it means Homebridge has restored all cached accessories from disk.
	  // Dynamic Platform plugins should only register new accessories after this event was fired,
	  // in order to ensure they weren't added to homebridge already. This event can also be used
	  // to start discovery of new accessories.
	  this.api.on('didFinishLaunching', () => {
	    log.debug('Executed didFinishLaunching callback');
	    // run the method to discover / register your devices as accessories
	    this.discoverDevices();
	    this.test();
	    this.intervalTimers();
	  });


	}





	//loggingService = new FakeGatoHistoryService(accessoryType, Accessory, length);

	//loggingService = new FakeGatoHistoryService('weather', this, { storage: 'fs' });

	/**
	* This function is invoked when homebridge restores cached accessories from disk at startup.
	* It should be used to setup event handlers for characteristics and update respective values.
	*/
	configureAccessory(accessory: PlatformAccessory) {
	  // eslint-disable-next-line no-mixed-spaces-and-tabs
	  this.log.info('Loading accessory from cache:', accessory.displayName);

	  // add the restored accessory to the accessories cache so we can track if it has already been registered
	  this.accessories.push(accessory);
	}

	/**
	* This is an example method showing how to register discovered accessories.
	* Accessories must only be registered once, previously created accessories
	* must not be registered again to prevent "duplicate UUID" errors.
	*/
	discoverDevices() {

	  // EXAMPLE ONLY
	  // A real plugin you would discover accessories from the local network, cloud services
	  // or a user-defined array in the platform config.
	  const exampleDevices = [
	    {
	      exampleUniqueId: '11111',
	      exampleDisplayName: 'b',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '22222',
	      exampleDisplayName: 'k',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '33333',
	      exampleDisplayName: 'r',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '44444',
	      exampleDisplayName: 'h',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '55555',
	      exampleDisplayName: 'g',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '66666',
	      exampleDisplayName: 'j',
	      exampleStates: false,
	    },
	    {
	      exampleUniqueId: '8556',
	      exampleDisplayName: 'u',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '889',
	      exampleDisplayName: 's',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '7777',
	      exampleDisplayName: 't',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '345353',
	      exampleDisplayName: 'z',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '99976',
	      exampleDisplayName: 'q',
	      exampleStates: true,
	    },
	    {
	      exampleUniqueId: '345262',
	      exampleDisplayName: 'l',
	      exampleStates: false,
	    },

	  ];


      
	  // loop over the discovered devices and register each one if it has not already been registered
	  for (const device of exampleDevices) {

	    // generate a unique id for the accessory this should be generated from
	    // something globally unique, but constant, for example, the device serial
	    // number or MAC address
	    const uuid = this.api.hap.uuid.generate(device.exampleUniqueId);

	    // see if an accessory with the same uuid has already been registered and restored from
	    // the cached devices we stored in the `configureAccessory` method above
	    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);


	    if (existingAccessory) {
	      // the accessory already exists
	      if (device) {
	        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

	        // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
	        // existingAccessory.context.device = device;
	        // this.api.updatePlatformAccessories([existingAccessory]);

	        // create the accessory handler for the restored accessory
	        // this is imported from `platformAccessory.ts`

	        //new ExamplePlatformAccessory(this, existingAccessory);
	        new ColorTemperatureBulbExample(this, existingAccessory);
	        this.data.push(existingAccessory);
	        // this.test(existingAccessory);
	        // update accessory cache with any changes to the accessory details and information
	        this.api.updatePlatformAccessories([existingAccessory]);

	      } else if (!device) {
	        // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
	        // remove platform accessories when no longer present
	        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
	        this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
	      }
	    } else {
	      // the accessory does not yet exist, so we need to create it
	      this.log.info('Adding new accessory:', device.exampleDisplayName);

	      // create a new accessory
	      const accessory = new this.api.platformAccessory(device.exampleDisplayName, uuid);
	      // store a copy of the device object in the `accessory.context`
	      // the `context` property can be used to store any data about the accessory you may need
	      accessory.context.device = device;

	      // create the accessory handler for the newly create accessory
	      // this is imported from `platformAccessory.ts`


	      //new ExamplePlatformAccessory(this, accessory);
	      new ColorTemperatureBulbExample(this, accessory);
	      this.data.push(accessory);


	      // link the accessory to your platform
	      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
	      //this.test(accessory);
	    }

	  }


	}

	test(): void {

	  this.data.forEach(obj => {



			obj.getService(this.api.hap.Service.Lightbulb)!.getCharacteristic(this.api.hap.Characteristic.On)
			  .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
			    obj.context.device.exampleStates = value;
			    this.log.info('Light State set to- : ' + value);
			    callback();
			  });


			obj.getService(this.api.hap.Service.Lightbulb)!.getCharacteristic(this.api.hap.Characteristic.On)
			  .on('get', (callback: CharacteristicGetCallback) => {
			    const value = obj.context.device.exampleStates as boolean;
			    this.log.info('Get Light State - %s: %s', value, obj.context.device.exampleDisplayName);
			    callback(null, value);
			  });

			obj.getService(this.api.hap.Service.Lightbulb)!.getCharacteristic(this.api.hap.Characteristic.Brightness)
			  .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
			    this.log.info('%s Light was set Brightness to: ' + value, obj.context.device.exampleDisplayName);
			    //this.log.info('%s Light ' + value, accessory.context.device.exampleUniqueId);

			    // this.sendCommand(value, accessory.context.device.exampleDisplayName);


			    callback();
			  });


			

	  });

	}


	intervalTimers(){
	  setInterval(() => {
	    //  const uuid = this.api.hap.uuid.generate('345262');
	    //  
	    this.data.forEach(value => {
	     // const val = this.accessories.find(accessory => accessory.UUID === '345262');
	     
				  value.getService(this.api.hap.Service.Lightbulb)!
				    .updateCharacteristic(this.api.hap.Characteristic.Brightness, Math.random() * 100);
				  this.log.info('%s Light update value ');
			 

	    });


		  }, 2000);
	}
	
}
