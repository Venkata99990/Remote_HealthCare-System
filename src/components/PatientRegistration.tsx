import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Key, Hash, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PatientRegistration = () => {
  const [patientId, setPatientId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [hashValue, setHashValue] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const { toast } = useToast();

  const generateKeyPair = async () => {
    setIsGeneratingKeys(true);
    // Simulate key generation
    setTimeout(() => {
      const mockPublicKey = `PK_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const mockHash = `H_${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
      setPublicKey(mockPublicKey);
      setHashValue(mockHash);
      setIsGeneratingKeys(false);
      toast({
        title: "Keys Generated",
        description: "Public/Private key pair generated successfully"
      });
    }, 2000);
  };

  const handleRegistration = () => {
    if (!patientId || !publicKey || !hashValue) {
      toast({
        title: "Error",
        description: "Please fill all fields and generate keys",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration
    setTimeout(() => {
      setIsRegistered(true);
      toast({
        title: "Registration Successful",
        description: "Patient registered to hospital system"
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-primary/20 shadow-medical">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl bg-gradient-medical bg-clip-text text-transparent">
              Patient Registration
            </CardTitle>
          </div>
          <CardDescription>
            Register to the Secure Hospital Monitoring System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRegistered ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="patientId" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Patient ID</span>
                </Label>
                <Input
                  id="patientId"
                  placeholder="Enter your Patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>Cryptographic Keys</span>
                  </Label>
                  <Button
                    onClick={generateKeyPair}
                    disabled={isGeneratingKeys}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingKeys ? 'Generating...' : 'Generate Keys'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key</Label>
                  <Input
                    id="publicKey"
                    placeholder="Generated public key will appear here"
                    value={publicKey}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hash" className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <span>Hash Value</span>
                  </Label>
                  <Input
                    id="hash"
                    placeholder="Generated hash will appear here"
                    value={hashValue}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <Button
                onClick={handleRegistration}
                className="w-full bg-gradient-medical hover:shadow-glow"
                disabled={!patientId || !publicKey || !hashValue}
              >
                Register to Hospital System
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-medical-success mx-auto" />
              <h3 className="text-lg font-semibold text-medical-success">
                Registration Successful!
              </h3>
              <div className="space-y-2">
                <Badge variant="outline" className="border-medical-success text-medical-success">
                  Patient ID: {patientId}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Digital certificate issued. You can now transmit vital signs securely.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;