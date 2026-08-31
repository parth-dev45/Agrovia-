import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiStepForm } from '@/components/MultiStepForm';
import { ProgressSteps } from '@/components/ProgressSteps';
import { QuickActions } from '@/components/QuickActions';
import { NotificationCenter } from '@/components/NotificationCenter';

export default function ComponentDemo() {
  const [demoData, setDemoData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Demo form steps
  const demoSteps = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Enter your basic details',
      validation: () => {
        return demoData.name.trim().length > 0 && demoData.email.trim().length > 0;
      },
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name..."
              value={demoData.name}
              onChange={(e) => setDemoData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email..."
              value={demoData.email}
              onChange={(e) => setDemoData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>
      )
    },
    {
      id: 'message',
      title: 'Message',
      description: 'Write your message',
      optional: true,
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <textarea
              id="message"
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              placeholder="Enter your message..."
              value={demoData.message}
              onChange={(e) => setDemoData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>
        </div>
      )
    }
  ];

  const handleSubmit = async () => {
    console.log('Demo form submitted:', demoData);
    alert('Demo form submitted successfully!');
  };

  const handleSave = async () => {
    console.log('Demo form saved:', demoData);
    localStorage.setItem('demo-form-data', JSON.stringify(demoData));
  };

  // Demo progress steps
  const progressSteps = [
    { id: '1', title: 'Start', completed: true },
    { id: '2', title: 'Progress', current: true },
    { id: '3', title: 'Complete' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Component Demo</h1>
          <p className="text-muted-foreground">
            Showcase of improved AgroVia components
          </p>
        </div>

        <div className="space-y-8">
          {/* Progress Steps Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Progress Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressSteps 
                steps={progressSteps} 
                currentStep={1}
                allowClickableSteps={true}
                onStepClick={(step) => console.log('Step clicked:', step)}
              />
            </CardContent>
          </Card>

          {/* Quick Actions Demo */}
          <Card data-testid="quick-actions">
            <CardHeader>
              <CardTitle>Enhanced Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions 
                compact={true}
                onActionClick={(actionId) => console.log('Action clicked:', actionId)}
              />
            </CardContent>
          </Card>

          {/* Multi-Step Form Demo */}
          <Card data-testid="multi-step-form">
            <CardHeader>
              <CardTitle>Enhanced Multi-Step Form</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiStepForm
                steps={demoSteps}
                onSubmit={handleSubmit}
                onSave={handleSave}
                showProgress={true}
                allowSkip={true}
                allowClickableSteps={true}
                autoSave={true}
                autoSaveDelay={2000}
              />
            </CardContent>
          </Card>

          {/* Component Demo Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Component Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()}>
                  Refresh Demo
                </Button>
                <Button variant="outline" onClick={() => console.log('Demo data:', demoData)}>
                  Log Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}