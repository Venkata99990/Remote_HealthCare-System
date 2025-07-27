import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Droplets, Thermometer, Wifi, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  timestamp: Date;
}

interface PatientMonitoringProps {
  patientId: string;
  staffType: string;
  staffId: string;
}

const PatientMonitoring = ({ patientId, staffType, staffId }: PatientMonitoringProps) => {
  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenSaturation: 98,
    temperature: 98.6,
    timestamp: new Date()
  });
  
  const [isTransmitting, setIsTransmitting] = useState(true);
  const [encryptionStatus, setEncryptionStatus] = useState('encrypted');
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time vital signs with some randomness
      const newVitals: VitalSigns = {
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
        bloodPressure: {
          systolic: Math.floor(Math.random() * 40) + 110, // 110-150
          diastolic: Math.floor(Math.random() * 30) + 70   // 70-100
        },
        oxygenSaturation: Math.floor(Math.random() * 5) + 95, // 95-100%
        temperature: Math.round((Math.random() * 4 + 97) * 10) / 10, // 97-101°F
        timestamp: new Date()
      };

      setVitals(newVitals);

      // Check for alerts
      if (newVitals.heartRate > 100 || newVitals.heartRate < 60 || 
          newVitals.bloodPressure.systolic > 140 || 
          newVitals.oxygenSaturation < 95 ||
          newVitals.temperature > 100.4) {
        if (newVitals.heartRate > 120 || newVitals.oxygenSaturation < 90) {
          setAlertLevel('critical');
          toast({
            title: "CRITICAL ALERT",
            description: "Patient requires immediate attention",
            variant: "destructive"
          });
        } else {
          setAlertLevel('warning');
        }
      } else {
        setAlertLevel('normal');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [toast]);

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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            Patient Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground">
            Viewing as: {staffType} {staffId} | Patient: {patientId}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isTransmitting ? "default" : "secondary"} className="flex items-center space-x-1">
            <Wifi className="h-3 w-3" />
            <span>{isTransmitting ? 'Live' : 'Offline'}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 border-primary text-primary">
            <Shield className="h-3 w-3" />
            <span>Encrypted</span>
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
                <span>Heart Rate</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}>
                {getVitalStatus('heartRate', vitals.heartRate)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.heartRate}</div>
            <p className="text-xs text-muted-foreground">BPM</p>
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
                <span>Blood Pressure</span>
              </CardTitle>
              <Badge variant="outline" className="text-medical-success">
                normal
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
            </div>
            <p className="text-xs text-muted-foreground">mmHg</p>
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
                <span>SpO₂</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}>
                {getVitalStatus('oxygenSaturation', vitals.oxygenSaturation)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.oxygenSaturation}%</div>
            <p className="text-xs text-muted-foreground">Oxygen Saturation</p>
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
                <span>Temperature</span>
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(getVitalStatus('temperature', vitals.temperature))}>
                {getVitalStatus('temperature', vitals.temperature)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vitals.temperature}°F</div>
            <p className="text-xs text-muted-foreground">Body Temperature</p>
            <Progress 
              value={((vitals.temperature - 95) / 10) * 100} 
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>

      {/* Data Transmission Info */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Secure Data Transmission</span>
          </CardTitle>
          <CardDescription>
            Real-time encrypted transmission from WBAN sensors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Last Update</p>
              <p className="text-foreground">{vitals.timestamp.toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Encryption Status</p>
              <Badge variant="outline" className="border-primary text-primary">
                AES-256 Encrypted
              </Badge>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Authentication</p>
              <Badge variant="outline" className="border-medical-success text-medical-success">
                Verified Digital Signature
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-data-flow"></div>
              <span>Data flowing from WBAN → Personal Server → Hospital Server</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMonitoring;