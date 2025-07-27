import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Droplets, Thermometer, Wifi, Shield, AlertTriangle, Radio, Signal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BLEWBANDataGenerator, type VitalSignsReading, type BLEWBANFrame, WBAN_POSITIONS } from '@/data/bleWbanDataGenerator';

interface WBANNetworkData {
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
}

interface PatientMonitoringProps {
  patientId: string;
  staffType: string;
  staffId: string;
}

const PatientMonitoring = ({ patientId, staffType, staffId }: PatientMonitoringProps) => {
  const [wbanData, setWbanData] = useState<WBANNetworkData | null>(null);
  const [dataGenerator] = useState(() => new BLEWBANDataGenerator());
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate realistic WBAN data using Iowa State University dataset patterns
      const newWbanData = dataGenerator.generateWBANReading(patientId);
      setWbanData(newWbanData);

      const vitals = newWbanData.vitals;

      // Check for alerts based on realistic vital sign ranges
      if (vitals.heartRate > 100 || vitals.heartRate < 60 || 
          vitals.bloodPressure.systolic > 140 || 
          vitals.oxygenSaturation < 95 ||
          vitals.temperature > 100.4) {
        if (vitals.heartRate > 120 || vitals.oxygenSaturation < 90) {
          setAlertLevel('critical');
          toast({
            title: "CRITICAL ALERT",
            description: `Patient ${patientId} requires immediate attention - Signal Quality: ${vitals.signalQuality}`,
            variant: "destructive"
          });
        } else {
          setAlertLevel('warning');
        }
      } else {
        setAlertLevel('normal');
      }
    }, 2000); // Faster updates to simulate real-time BLE transmission

    return () => clearInterval(interval);
  }, [patientId, dataGenerator, toast]);

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 120) return 'critical';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'warning';
        if (value < 90) return 'critical';
        return 'normal';
      case 'temperature':
        if (value > 100.4 || value < 97) return 'warning';
        if (value > 102 || value < 95) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-medical-emergency';
      case 'warning': return 'text-medical-warning';
      default: return 'text-medical-success';
    }
  };

  if (!wbanData) {
    return <div className="max-w-6xl mx-auto p-6 text-center">Loading WBAN data...</div>;
  }

  const { vitals, networkStats, bleFrames } = wbanData;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            BLEWBAN Patient Monitoring
          </h1>
          <p className="text-muted-foreground">
            Viewing as: {staffType} {staffId} | Patient: {patientId} | Signal Quality: {vitals.signalQuality}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={vitals.connectionStatus === 'connected' ? "default" : "secondary"} className="flex items-center space-x-1">
            <Radio className="h-3 w-3" />
            <span>BLE {vitals.connectionStatus}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 border-primary text-primary">
            <Shield className="h-3 w-3" />
            <span>{networkStats.encryptionStatus}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 border-medical-info text-medical-info">
            <Signal className="h-3 w-3" />
            <span>{networkStats.activeDevices}/{networkStats.totalDevices} WBAN</span>
          </Badge>
          {alertLevel !== 'normal' && (
            <Badge variant="destructive" className="flex items-center space-x-1 animate-pulse-beat">
              <AlertTriangle className="h-3 w-3" />
              <span>{alertLevel.toUpperCase()}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Heart Rate */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Heart className={`h-5 w-5 ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))} animate-pulse-beat`} />
                <span>Heart Rate (ECG)</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}>
                {getVitalStatus('heartRate', vitals.heartRate)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.heartRate}</div>
            <p className="text-xs text-muted-foreground">BPM • Battery: {Math.round(vitals.batteryLevel)}%</p>
            <Progress 
              value={(vitals.heartRate / 120) * 100} 
              className="mt-3"
            />
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Activity className="h-5 w-5 text-medical-info" />
                <span>Blood Pressure (Arm)</span>
              </CardTitle>
              <Badge variant="outline" className="text-medical-success">
                {vitals.bloodPressure.systolic > 140 ? 'elevated' : 'normal'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
            </div>
            <p className="text-xs text-muted-foreground">mmHg • RSSI: {networkStats.averageRSSI}dBm</p>
            <div className="flex space-x-2 mt-3">
              <Progress value={(vitals.bloodPressure.systolic / 180) * 100} className="flex-1" />
              <Progress value={(vitals.bloodPressure.diastolic / 120) * 100} className="flex-1" />
            </div>
          </CardContent>
        </Card>

        {/* Oxygen Saturation */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Droplets className={`h-5 w-5 ${getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`} />
                <span>SpO₂ (Wrist)</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}>
                {getVitalStatus('oxygenSaturation', vitals.oxygenSaturation)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.oxygenSaturation}%</div>
            <p className="text-xs text-muted-foreground">Pulse Oximeter • Loss: {networkStats.packetLossRate}%</p>
            <Progress 
              value={vitals.oxygenSaturation} 
              className="mt-3"
            />
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Thermometer className={`h-5 w-5 ${getStatusColor(getVitalStatus('temperature', vitals.temperature))}`} />
                <span>Temperature (Head)</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('temperature', vitals.temperature))}>
                {getVitalStatus('temperature', vitals.temperature)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.temperature}°F</div>
            <p className="text-xs text-muted-foreground">Infrared Sensor • Frame: #{bleFrames[0]?.frameNumber || 0}</p>
            <Progress 
              value={((vitals.temperature - 95) / 10) * 100} 
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>

      {/* BLEWBAN Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Radio className="h-5 w-5 text-primary" />
              <span>BLE WBAN Network Status</span>
            </CardTitle>
            <CardDescription>
              Iowa State University BLEWBAN Dataset Integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Active Sensors</p>
                <p className="text-foreground text-lg font-semibold">{networkStats.activeDevices}/{networkStats.totalDevices}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Signal Strength</p>
                <p className="text-foreground text-lg font-semibold">{networkStats.averageRSSI} dBm</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Packet Loss</p>
                <p className="text-foreground text-lg font-semibold">{networkStats.packetLossRate}%</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Data Quality</p>
                <Badge variant="outline" className={`${vitals.signalQuality === 'excellent' ? 'border-medical-success text-medical-success' : 
                  vitals.signalQuality === 'good' ? 'border-primary text-primary' : 
                  vitals.signalQuality === 'fair' ? 'border-medical-warning text-medical-warning' : 
                  'border-medical-emergency text-medical-emergency'}`}>
                  {vitals.signalQuality}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">WBAN Sensor Positions:</div>
              <div className="flex flex-wrap gap-1">
                {WBAN_POSITIONS.map(sensor => (
                  <Badge key={sensor.id} variant="outline" className="text-xs">
                    {sensor.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure Transmission</span>
            </CardTitle>
            <CardDescription>
              End-to-end encrypted BLE communication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Last Update</p>
                <p className="text-foreground">{vitals.timestamp.toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Encryption</p>
                <Badge variant="outline" className="border-primary text-primary">
                  {networkStats.encryptionStatus} Encrypted
                </Badge>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Authentication</p>
                <Badge variant="outline" className="border-medical-success text-medical-success">
                  RSA Digital Signature
                </Badge>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">BLE Frequency</p>
                <p className="text-foreground">2.4 GHz ISM Band (37-39 channels)</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-data-flow"></div>
                <span>BLE WBAN → Personal Server → Hospital Server → Medical Terminal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientMonitoring;