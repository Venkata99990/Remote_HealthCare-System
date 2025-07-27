import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Key, UserCheck, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicalStaffLoginProps {
  onLogin: (staffType: string, staffId: string) => void;
}

const MedicalStaffLogin = ({ onLogin }: MedicalStaffLoginProps) => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [staffType, setStaffType] = useState('doctor');
  const [publicKey, setPublicKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateStaffKey = () => {
    const key = `${staffType.toUpperCase()}_KEY_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    setPublicKey(key);
    toast({
      title: "Key Generated",
      description: "Staff public key generated successfully"
    });
  };

  const handleLogin = async () => {
    if (!staffId || !password || !publicKey) {
      toast({
        title: "Error",
        description: "Please fill all fields and generate your public key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Authentication Successful",
        description: `Welcome, ${staffType} ${staffId}`
      });
      onLogin(staffType, staffId);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="border-accent/20 shadow-medical">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="h-8 w-8 text-accent" />
            <CardTitle className="text-2xl text-accent">
              Medical Staff Login
            </CardTitle>
          </div>
          <CardDescription>
            Authenticate to access patient monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Staff Type</Label>
            <div className="flex space-x-2">
              <Button
                variant={staffType === 'doctor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStaffType('doctor')}
                className="flex-1"
              >
                Doctor
              </Button>
              <Button
                variant={staffType === 'nurse' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStaffType('nurse')}
                className="flex-1"
              >
                Nurse
              </Button>
              <Button
                variant={staffType === 'specialist' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStaffType('specialist')}
                className="flex-1"
              >
                Specialist
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffId" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Staff ID</span>
            </Label>
            <Input
              id="staffId"
              placeholder="Enter your staff ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Public Key</span>
              </Label>
              <Button
                onClick={generateStaffKey}
                variant="outline"
                size="sm"
              >
                Generate
              </Button>
            </div>
            <Input
              placeholder="Generated public key"
              value={publicKey}
              readOnly
              className="bg-muted text-xs"
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading || !staffId || !password || !publicKey}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </Button>

          <div className="text-center">
            <Badge variant="outline" className="border-accent/30 text-accent">
              Hospital Authorized Access Only
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalStaffLogin;