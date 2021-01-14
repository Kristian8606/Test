/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs */
import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { ExamplePlatformAccessory } from './platformAccessory';
import { ColorTemperatureBulbExample } from './ColorTemperatureBulb';
import { log, time, timeStamp } from 'console';


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
	    },
	    {
	      exampleUniqueId: '22222',
	      exampleDisplayName: 'k',
	    },
	    {
	      exampleUniqueId: '33333',
	      exampleDisplayName: 'r',
	    },
	    {
	      exampleUniqueId: '44444',
	      exampleDisplayName: 'h',
	    },
	    {
	      exampleUniqueId: '55555',
	      exampleDisplayName: 'g',
	    },
	    {
	      exampleUniqueId: '66666',
	      exampleDisplayName: 'j',
	    },
	    {
	      exampleUniqueId: '8556',
	      exampleDisplayName: 'u',
		  },
		  {
	      exampleUniqueId: '889',
	      exampleDisplayName: 's',
		  },
		  {
	      exampleUniqueId: '7777',
	      exampleDisplayName: 't',
		  },
		  {
	      exampleUniqueId: '345353',
	      exampleDisplayName: 'z',
		  },
		  {
	      exampleUniqueId: '99976',
	      exampleDisplayName: 'q',
		  },
		  {
	      exampleUniqueId: '345262',
	      exampleDisplayName: 'l',
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
	        this.test(existingAccessory);
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



	      // link the accessory to your platform
	      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
	      this.test(accessory);
	    }

	  }


	}

	test(accessory: PlatformAccessory): void {

		accessory.getService(this.api.hap.Service.Lightbulb)!.getCharacteristic(this.api.hap.Characteristic.On)
		  .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
		    // this.log.info('%s Light was set to: ' + value, accessory.context.device.exampleDisplayName);
		    callback();
		  });

		accessory.getService(this.api.hap.Service.Lightbulb)!.getCharacteristic(this.api.hap.Characteristic.Brightness)
		  .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
		    this.log.info('%s Light was set Brightness to: ' + value, accessory.context.device.exampleDisplayName);

		    this.sendCommand(value, accessory.context.device.exampleDisplayName);

		    callback();
		  });


	}


	sendCommand(value, name) {
	  let time = 0;
	  time = this.handlle.length * 100;
	  this.handlle.push(value);
	  const a = Date.now();
	  setTimeout(() => {
	    console.log('%s %s handlle - %s', name, value + ' ' + (Date.now() - a), this.handlle.length);
	    this.handlle.pop();
	  }, time);


	}
}
