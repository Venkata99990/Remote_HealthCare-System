import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Users, Server, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

const SecurityOverview = () => {
  const securitySteps = [
    {
      phase: "Registration",
      icon: Users,
      items: [
        "Patient registers with PID",
        "Generate public/private key pair",
        "Send PID, public key, hash to Hospital Server",
        "Hospital issues digital certificate"
      ]
    },
    {
      phase: "Authentication",
      icon: Key,
      items: [
        "Patient signs data with private key",
        "Encrypt using hospital's public key",
        "Hospital verifies signature",
        "Authenticate data integrity"
      ]
    },
    {
      phase: "Access Control",
      icon: Shield,
      items: [
        "Medical staff authenticate with credentials",
        "Verify digital certificates",
        "Grant role-based access",
        "Monitor all access attempts"
      ]
    }
  ];

  const systemComponents = [
    {
      name: "WBAN Sensors",
      icon: Smartphone,
      description: "Collect vital signs",
      security: "Hardware-level encryption"
    },
    {
      name: "Personal Server",
      icon: Smartphone,
      description: "Gateway device",
      security: "Private key storage"
    },
    {
      name: "Hospital Server",
      icon: Server,
      description: "Central authority",
      security: "Certificate management"
    },
    {
      name: "Medical Terminals",
      icon: Users,
      description: "Staff access points",
      security: "Role-based authentication"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-medical bg-clip-text text-transparent">
          Secure Patient Monitoring System
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A comprehensive Wireless Body Area Network (WBAN) solution with end-to-end encryption,
          digital certificates, and role-based access control for healthcare environments.
        </p>
      </div>

      {/* System Architecture */}
      <Card className="border-primary/20 shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-primary" />
            <span>System Architecture</span>
          </CardTitle>
          <CardDescription>
            Components of the secure patient monitoring ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemComponents.map((component, index) => (
              <div key={index} className="relative">
                <Card className="border-accent/30 hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <component.icon className="h-5 w-5 text-accent" />
                      <CardTitle className="text-sm">{component.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{component.description}</p>
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      {component.security}
                    </Badge>
                  </CardContent>
                </Card>
                {index < systemComponents.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {securitySteps.map((step, index) => (
          <Card key={index} className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <step.icon className="h-5 w-5 text-primary" />
                <span>{step.phase}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-medical-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span>Security Features</span>
          </CardTitle>
          <CardDescription>
            Advanced security measures protecting patient data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Encryption</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AES-256 symmetric encryption</li>
                <li>• RSA public-key cryptography</li>
                <li>• End-to-end data protection</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Authentication</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Digital certificates</li>
                <li>• Public key infrastructure</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Access Control</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Role-based permissions</li>
                <li>• Audit trail logging</li>
                <li>• Session management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle>Implementation Benefits</CardTitle>
          <CardDescription>
            Key advantages of this secure monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Security Benefits</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="border-medical-success text-medical-success">
                  Prevents unauthorized access
                </Badge>
                <Badge variant="outline" className="border-medical-success text-medical-success">
                  Ensures data integrity
                </Badge>
                <Badge variant="outline" className="border-medical-success text-medical-success">
                  HIPAA compliant
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Operational Benefits</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="border-accent text-accent">
                  Real-time monitoring
                </Badge>
                <Badge variant="outline" className="border-accent text-accent">
                  Scalable architecture
                </Badge>
                <Badge variant="outline" className="border-accent text-accent">
                  Automated alerts
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview;