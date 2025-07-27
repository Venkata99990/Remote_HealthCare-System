import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Heart, Users, Activity } from 'lucide-react';
import PatientRegistration from '@/components/PatientRegistration';
import MedicalStaffLogin from '@/components/MedicalStaffLogin';
import PatientMonitoring from '@/components/PatientMonitoring';
import SecurityOverview from '@/components/SecurityOverview';

const Index = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [loggedInStaff, setLoggedInStaff] = useState<{type: string, id: string} | null>(null);
  const [registeredPatient, setRegisteredPatient] = useState<string | null>(null);

  const handleStaffLogin = (staffType: string, staffId: string) => {
    setLoggedInStaff({ type: staffType, id: staffId });
    setCurrentView('monitoring');
  };

  const handleLogout = () => {
    setLoggedInStaff(null);
    setCurrentView('overview');
  };

  if (currentView === 'monitoring' && loggedInStaff) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">Secure Pulse Guardian</span>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
        <PatientMonitoring 
          patientId="P001" 
          staffType={loggedInStaff.type} 
          staffId={loggedInStaff.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-medical rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
                Secure Pulse Guardian
              </h1>
              <p className="text-muted-foreground">Wireless Body Area Network Monitoring System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={currentView} onValueChange={setCurrentView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Patient Registration</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Medical Staff</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Welcome to Secure Patient Monitoring</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience the future of healthcare with our secure WBAN system featuring end-to-end encryption,
                digital certificates, and real-time patient monitoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:shadow-medical transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>Patient Registration</span>
                  </CardTitle>
                  <CardDescription>
                    Secure patient onboarding with cryptographic key generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setCurrentView('patient')} 
                    className="w-full bg-gradient-medical hover:shadow-glow"
                  >
                    Register Patient
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:shadow-medical transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>Medical Staff Access</span>
                  </CardTitle>
                  <CardDescription>
                    Authenticated access for healthcare professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setCurrentView('staff')} 
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Staff Login
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:shadow-medical transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Security Overview</span>
                  </CardTitle>
                  <CardDescription>
                    Learn about our comprehensive security measures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setCurrentView('security')} 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5"
                  >
                    View Security
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patient">
            <PatientRegistration />
          </TabsContent>

          <TabsContent value="staff">
            <MedicalStaffLogin onLogin={handleStaffLogin} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
