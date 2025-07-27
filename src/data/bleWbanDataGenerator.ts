// BLEWBAN Dataset Integration - Real BLE Signal Simulation
// Based on Iowa State University BLEWBAN Dataset: https://github.com/mkashani-phd/BLEWBAN_Dataset

interface BLEWBANFrame {
  frameNumber: number;
  timestamp: number;
  deviceId: string;
  position: 'head' | 'arm' | 'wrist' | 'chest' | 'torso_front' | 'torso_back';
  txPower: string; // '9dbm', '6dbm', '3dbm', '0dbm'
  antenna: number;
  frequency: number; // 2.4GHz band
  channelNumber: number;
  rssi: number;
  signalStrength: number;
  frameDecoded: boolean;
  bitLength: number;
  maxGradientUnwrappedPhase: number[];
  iComponent: number[]; // Real part of complex signal
  qComponent: number[]; // Imaginary part of complex signal
}

interface VitalSignsReading {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  timestamp: Date;
  signalQuality: 'excellent' | 'good' | 'fair' | 'poor';
  batteryLevel: number;
  connectionStatus: 'connected' | 'weak' | 'disconnected';
}

// Simulate realistic WBAN sensor positions based on BLEWBAN dataset
const WBAN_POSITIONS = [
  { id: 'chest', name: 'Chest ECG', position: 'chest' as const, priority: 1 },
  { id: 'wrist_l', name: 'Left Wrist', position: 'wrist' as const, priority: 2 },
  { id: 'wrist_r', name: 'Right Wrist', position: 'wrist' as const, priority: 2 },
  { id: 'head', name: 'Head Monitor', position: 'head' as const, priority: 3 },
  { id: 'arm_l', name: 'Left Arm BP', position: 'arm' as const, priority: 2 },
  { id: 'torso_back', name: 'Back Monitor', position: 'torso_back' as const, priority: 4 }
];

// BLE frequency channels (37, 38, 39 are advertising channels)
const BLE_CHANNELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];

class BLEWBANDataGenerator {
  private frameCounter = 0;
  private lastReadings: Map<string, VitalSignsReading> = new Map();
  private signalNoiseFactors: Map<string, number> = new Map();

  constructor() {
    // Initialize noise factors for each sensor position
    WBAN_POSITIONS.forEach(pos => {
      this.signalNoiseFactors.set(pos.id, Math.random() * 0.1 + 0.9); // 0.9-1.0 quality factor
    });
  }

  // Generate realistic BLE frame data based on BLEWBAN dataset structure
  generateBLEFrame(deviceId: string, position: typeof WBAN_POSITIONS[0]['position']): BLEWBANFrame {
    this.frameCounter++;
    
    // Simulate realistic BLE transmission parameters from dataset
    const txPower = Math.random() > 0.7 ? '9dbm' : Math.random() > 0.5 ? '6dbm' : '3dbm';
    const channel = BLE_CHANNELS[Math.floor(Math.random() * BLE_CHANNELS.length)];
    const frequency = 2402000000 + (channel * 2000000); // 2.402-2.480 GHz
    
    // Generate I/Q components (complex signal representation)
    const frameLength = Math.floor(Math.random() * 1000) + 8000; // 8000-9000 samples
    const iComponent = Array.from({ length: 10 }, () => (Math.random() - 0.5) * 0.02);
    const qComponent = Array.from({ length: 10 }, () => (Math.random() - 0.5) * 0.02);
    
    // Signal quality affects RSSI and phase unwrapping
    const noiseLevel = this.signalNoiseFactors.get(deviceId) || 1;
    const baseRSSI = -40; // Strong signal baseline
    const rssi = baseRSSI + (Math.random() * 20 - 10) * (1 / noiseLevel);
    
    return {
      frameNumber: this.frameCounter,
      timestamp: Date.now(),
      deviceId,
      position,
      txPower,
      antenna: Math.floor(Math.random() * 4) + 1, // 1-4 antennas
      frequency,
      channelNumber: channel,
      rssi,
      signalStrength: Math.max(0, Math.min(100, (rssi + 100) * 1.25)), // Convert to 0-100%
      frameDecoded: Math.random() > 0.05, // 95% success rate
      bitLength: Math.floor(Math.random() * 100) + 150,
      maxGradientUnwrappedPhase: Array.from({ length: 5 }, () => Math.random() * 0.03 - 0.015),
      iComponent,
      qComponent
    };
  }

  // Extract vital signs from BLE signal characteristics
  extractVitalSigns(bleFrame: BLEWBANFrame): VitalSignsReading {
    const deviceId = bleFrame.deviceId;
    const lastReading = this.lastReadings.get(deviceId);
    
    // Signal quality based on RSSI and frame decode success
    let signalQuality: VitalSignsReading['signalQuality'] = 'excellent';
    if (bleFrame.rssi < -70 || !bleFrame.frameDecoded) signalQuality = 'poor';
    else if (bleFrame.rssi < -60) signalQuality = 'fair';
    else if (bleFrame.rssi < -50) signalQuality = 'good';
    
    // Generate realistic vital signs with position-specific variations
    let heartRate = 72;
    let systolic = 120;
    let diastolic = 80;
    let oxygenSat = 98;
    let temperature = 98.6;
    
    // Position-specific signal characteristics
    switch (bleFrame.position) {
      case 'chest':
        // ECG sensor - most accurate heart rate
        heartRate = this.generateHeartRate(lastReading?.heartRate, 0.8);
        break;
      case 'wrist':
        // Pulse oximeter - good for SpO2 and HR
        heartRate = this.generateHeartRate(lastReading?.heartRate, 0.9);
        oxygenSat = this.generateOxygenSat(lastReading?.oxygenSaturation, 0.9);
        break;
      case 'arm':
        // Blood pressure cuff
        const bp = this.generateBloodPressure(lastReading?.bloodPressure);
        systolic = bp.systolic;
        diastolic = bp.diastolic;
        break;
      case 'head':
        // Temperature sensor
        temperature = this.generateTemperature(lastReading?.temperature);
        break;
      case 'torso_back':
        // Multi-sensor monitoring
        heartRate = this.generateHeartRate(lastReading?.heartRate, 0.7);
        temperature = this.generateTemperature(lastReading?.temperature);
        break;
    }
    
    // Signal quality affects accuracy
    const qualityFactor = signalQuality === 'excellent' ? 1 : 
                         signalQuality === 'good' ? 0.95 :
                         signalQuality === 'fair' ? 0.85 : 0.7;
    
    const reading: VitalSignsReading = {
      heartRate: Math.round(heartRate * qualityFactor),
      bloodPressure: { 
        systolic: Math.round(systolic * qualityFactor), 
        diastolic: Math.round(diastolic * qualityFactor) 
      },
      oxygenSaturation: Math.round(oxygenSat * qualityFactor),
      temperature: Math.round((temperature * qualityFactor) * 10) / 10,
      timestamp: new Date(bleFrame.timestamp),
      signalQuality,
      batteryLevel: Math.max(10, 100 - (this.frameCounter * 0.01)), // Gradual battery drain
      connectionStatus: bleFrame.signalStrength > 70 ? 'connected' : 
                       bleFrame.signalStrength > 40 ? 'weak' : 'disconnected'
    };
    
    this.lastReadings.set(deviceId, reading);
    return reading;
  }
  
  private generateHeartRate(lastValue?: number, stability = 0.9): number {
    const baseRate = lastValue || 72;
    const variation = (Math.random() - 0.5) * 10;
    return Math.max(50, Math.min(150, baseRate * stability + variation));
  }
  
  private generateBloodPressure(lastValue?: { systolic: number; diastolic: number }) {
    const baseSys = lastValue?.systolic || 120;
    const baseDia = lastValue?.diastolic || 80;
    return {
      systolic: Math.max(90, Math.min(180, baseSys + (Math.random() - 0.5) * 8)),
      diastolic: Math.max(60, Math.min(120, baseDia + (Math.random() - 0.5) * 6))
    };
  }
  
  private generateOxygenSat(lastValue?: number, stability = 0.95): number {
    const baseSat = lastValue || 98;
    const variation = (Math.random() - 0.5) * 2;
    return Math.max(85, Math.min(100, baseSat * stability + variation));
  }
  
  private generateTemperature(lastValue?: number): number {
    const baseTemp = lastValue || 98.6;
    const variation = (Math.random() - 0.5) * 0.5;
    return Math.max(95, Math.min(104, baseTemp + variation));
  }
  
  // Simulate complete WBAN network readings
  generateWBANReading(patientId: string): {
    patientId: string;
    vitals: VitalSignsReading;
    bleFrames: BLEWBANFrame[];
    networkStats: {
      totalDevices: number;
      activeDevices: number;
      averageRSSI: number;
      packetLossRate: number;
      encryptionStatus: 'AES-256' | 'AES-128' | 'none';
    };
  } {
    const bleFrames: BLEWBANFrame[] = [];
    const vitalReadings: VitalSignsReading[] = [];
    
    // Generate frames from multiple WBAN sensors
    WBAN_POSITIONS.forEach(sensor => {
      const frame = this.generateBLEFrame(`${patientId}_${sensor.id}`, sensor.position);
      bleFrames.push(frame);
      
      const vitals = this.extractVitalSigns(frame);
      vitalReadings.push(vitals);
    });
    
    // Aggregate vital signs (prioritize chest ECG for heart rate, etc.)
    const aggregatedVitals = this.aggregateVitalSigns(vitalReadings);
    
    // Calculate network statistics
    const activeFrames = bleFrames.filter(f => f.frameDecoded);
    const avgRSSI = bleFrames.reduce((sum, f) => sum + f.rssi, 0) / bleFrames.length;
    const packetLoss = (bleFrames.length - activeFrames.length) / bleFrames.length;
    
    return {
      patientId,
      vitals: aggregatedVitals,
      bleFrames,
      networkStats: {
        totalDevices: WBAN_POSITIONS.length,
        activeDevices: activeFrames.length,
        averageRSSI: Math.round(avgRSSI * 10) / 10,
        packetLossRate: Math.round(packetLoss * 1000) / 10, // Percentage
        encryptionStatus: 'AES-256'
      }
    };
  }
  
  private aggregateVitalSigns(readings: VitalSignsReading[]): VitalSignsReading {
    // Prioritize readings based on sensor reliability for each vital
    const chestReading = readings.find(r => r.signalQuality === 'excellent');
    const goodReadings = readings.filter(r => r.signalQuality !== 'poor');
    const bestReading = chestReading || goodReadings[0] || readings[0];
    
    // Use weighted average for some vitals
    const hrReadings = readings.filter(r => r.heartRate > 0);
    const avgHeartRate = hrReadings.length > 0 ? 
      Math.round(hrReadings.reduce((sum, r) => sum + r.heartRate, 0) / hrReadings.length) : 
      bestReading.heartRate;
    
    return {
      ...bestReading,
      heartRate: avgHeartRate,
      signalQuality: goodReadings.length > readings.length / 2 ? 'good' : 'fair',
      connectionStatus: readings.every(r => r.connectionStatus === 'connected') ? 'connected' :
                       readings.some(r => r.connectionStatus === 'connected') ? 'weak' : 'disconnected'
    };
  }
}

export { BLEWBANDataGenerator, type BLEWBANFrame, type VitalSignsReading, WBAN_POSITIONS };