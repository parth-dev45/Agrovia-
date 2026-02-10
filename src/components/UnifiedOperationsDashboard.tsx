import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Package, 
  ClipboardCheck, 
  Warehouse as WarehouseIcon,
  Save,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type WorkflowStep = 'harvest' | 'quality' | 'warehouse';

interface WorkflowData {
  batchId?: string;
  // Step 1: Harvest
  productId?: string;
  productName?: string;
  category?: string;
  quantity?: string;
  harvestDate?: string;
  farmLocation?: string;
  farmerNotes?: string;
  // Step 2: Quality
  visualQuality?: number;
  firmness?: string;
  qualityGrade?: string;
  inspectorNotes?: string;
  // Step 3: Warehouse
  storageLocation?: string;
  shelfBin?: string;
  temperatureZone?: string;
  receivedBy?: string;
  warehouseNotes?: string;
}

export default function UnifiedOperationsDashboard() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('harvest');
  const [workflowData, setWorkflowData] = useState<WorkflowData>({});
  const [isDraft, setIsDraft] = useState(false);

  // Auto-generate Batch ID on mount
  useEffect(() => {
    if (!workflowData.batchId) {
      const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
      setWorkflowData(prev => ({ ...prev, batchId }));
    }
  }, [workflowData.batchId]);

  const steps: { id: WorkflowStep; label: string; number: number }[] = [
    { id: 'harvest', label: 'Register Harvest', number: 1 },
    { id: 'quality', label: 'Quality Grading', number: 2 },
    { id: 'warehouse', label: 'Warehouse', number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateData = (field: keyof WorkflowData, value: any) => {
    setWorkflowData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem('workflow-draft', JSON.stringify(workflowData));
    setIsDraft(true);
    toast.success('Draft saved successfully');
  };

  const handleProceedToNext = () => {
    if (currentStep === 'harvest') {
      // Validate harvest data
      if (!workflowData.productName || !workflowData.quantity || !workflowData.harvestDate) {
        toast.error('Please fill all required fields');
        return;
      }
      setCurrentStep('quality');
      toast.success('Harvest registered. Proceeding to Quality Grading...');
    } else if (currentStep === 'quality') {
      // Validate quality data
      if (!workflowData.qualityGrade) {
        toast.error('Please select a quality grade');
        return;
      }
      setCurrentStep('warehouse');
      toast.success('Quality grading complete. Proceeding to Warehouse...');
    } else if (currentStep === 'warehouse') {
      // Validate warehouse data
      if (!workflowData.storageLocation) {
        toast.error('Please select a storage location');
        return;
      }
      toast.success(`Batch ${workflowData.batchId} successfully processed from farm to warehouse!`);
      // Reset workflow
      setWorkflowData({ batchId: `BATCH-${Date.now().toString().slice(-6)}` });
      setCurrentStep('harvest');
    }
  };

  const handleGoBack = () => {
    if (currentStep === 'quality') {
      setCurrentStep('harvest');
    } else if (currentStep === 'warehouse') {
      setCurrentStep('quality');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <Card className="border border-border rounded-md shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Batch:</span>
                <span className="text-sm font-mono font-semibold text-foreground">{workflowData.batchId || 'Generating...'}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = step.id === currentStep;
                const isUpcoming = index > currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all',
                          isCompleted && 'bg-[#D1FAE5] border-[#059669] text-[#065F46]',
                          isActive && 'bg-[#1E3A8A] border-[#1E3A8A] text-white',
                          isUpcoming && 'bg-[#F1F5F9] border-[#CBD5E1] text-[#94A3B8]'
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium mt-2 text-center',
                          isCompleted && 'text-[#065F46]',
                          isActive && 'text-[#1E3A8A] font-semibold',
                          isUpcoming && 'text-[#94A3B8]'
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'flex-1 h-0.5 mx-2 -mt-4',
                          isCompleted ? 'bg-[#059669]' : 'bg-[#CBD5E1]'
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border border-border rounded-md shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  {steps[currentStepIndex].label}
                  {workflowData.batchId && (
                    <span className="ml-2 text-sm font-mono font-normal text-muted-foreground">
                      {workflowData.batchId}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {currentStep === 'harvest' && 'Enter harvest details to begin the workflow'}
                  {currentStep === 'quality' && 'Grade the harvested product based on quality parameters'}
                  {currentStep === 'warehouse' && 'Assign storage location and complete inventory entry'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Register Harvest */}
            {currentStep === 'harvest' && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Tomatoes"
                      value={workflowData.productName || ''}
                      onChange={(e) => updateData('productName', e.target.value)}
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={workflowData.category} onValueChange={(v) => updateData('category', v)}>
                      <SelectTrigger className="rounded-md">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={workflowData.quantity || ''}
                      onChange={(e) => updateData('quantity', e.target.value)}
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="harvestDate">Harvest Date *</Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={workflowData.harvestDate || ''}
                      onChange={(e) => updateData('harvestDate', e.target.value)}
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="farmLocation">Farm Location</Label>
                    <Input
                      id="farmLocation"
                      placeholder="Enter farm location"
                      value={workflowData.farmLocation || ''}
                      onChange={(e) => updateData('farmLocation', e.target.value)}
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="farmerNotes">Farmer Notes</Label>
                    <Textarea
                      id="farmerNotes"
                      placeholder="Additional notes about this harvest..."
                      value={workflowData.farmerNotes || ''}
                      onChange={(e) => updateData('farmerNotes', e.target.value)}
                      className="rounded-md min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setWorkflowData({})}>
                    Cancel
                  </Button>
                  <Button onClick={handleProceedToNext} className="bg-[#1E3A8A] hover:bg-[#1E40AF]">
                    Save & Proceed to Grading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Quality Grading */}
            {currentStep === 'quality' && (
              <div className="space-y-6">
                {/* Harvest Summary (Read-only) */}
                <Card className="bg-[#F9FAFB] border border-border rounded-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Harvest Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{workflowData.productName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{workflowData.quantity || 'N/A'} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harvest Date:</span>
                        <span className="font-medium">{workflowData.harvestDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Batch ID:</span>
                        <span className="font-mono font-semibold">{workflowData.batchId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Parameters */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Quality Parameters</Label>
                  <div className="space-y-3">
                    {['Visual Inspection', 'Size Uniformity', 'Color Quality', 'Freshness', 'No Damage/Defects'].map((param) => (
                      <div key={param} className="flex items-center justify-between p-3 border border-border rounded-md">
                        <span className="text-sm font-medium">{param}</span>
                        <div className="flex gap-2">
                          <Button
                            variant={workflowData.visualQuality !== undefined ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                              'h-8 rounded-md text-xs',
                              workflowData.visualQuality !== undefined && 'bg-[#D1FAE5] text-[#065F46] border-[#059669] hover:bg-[#BBF7D0]'
                            )}
                            onClick={() => updateData('visualQuality', 5)}
                          >
                            Pass
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-md text-xs border-[#DC2626] text-[#991B1B] hover:bg-[#FEE2E2]"
                            onClick={() => updateData('visualQuality', 1)}
                          >
                            Fail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Overall Grade</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['A+', 'A', 'B', 'C', 'Reject'].map((grade) => (
                      <Button
                        key={grade}
                        variant={workflowData.qualityGrade === grade ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          'rounded-md',
                          workflowData.qualityGrade === grade && 'bg-[#1E3A8A] text-white'
                        )}
                        onClick={() => updateData('qualityGrade', grade)}
                      >
                        {grade}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspectorNotes">Inspector Notes</Label>
                  <Textarea
                    id="inspectorNotes"
                    placeholder="Add inspection notes..."
                    value={workflowData.inspectorNotes || ''}
                    onChange={(e) => updateData('inspectorNotes', e.target.value)}
                    className="rounded-md min-h-[100px]"
                  />
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleGoBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                  <Button onClick={handleProceedToNext} className="bg-[#1E3A8A] hover:bg-[#1E40AF]">
                    Grade Complete & Move to Warehouse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Warehouse */}
            {currentStep === 'warehouse' && (
              <div className="space-y-6">
                {/* Incoming Product Summary */}
                <Card className="bg-[#F9FAFB] border border-border rounded-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Incoming Product Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{workflowData.productName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{workflowData.quantity || 'N/A'} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grade:</span>
                        <Badge className="bg-[#D1FAE5] text-[#065F46] border-[#059669]">
                          {workflowData.qualityGrade || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Batch ID:</span>
                        <span className="font-mono font-semibold">{workflowData.batchId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality Status:</span>
                        <Badge className="bg-[#D1FAE5] text-[#065F46] border-[#059669]">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          PASSED
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warehouse Storage Details */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Warehouse Storage Details</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storageLocation">Storage Location *</Label>
                      <Select value={workflowData.storageLocation} onValueChange={(v) => updateData('storageLocation', v)}>
                        <SelectTrigger className="rounded-md">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="section-a">Section A</SelectItem>
                          <SelectItem value="section-b">Section B</SelectItem>
                          <SelectItem value="section-c">Section C</SelectItem>
                          <SelectItem value="section-d">Section D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shelfBin">Shelf/Bin Number</Label>
                      <Input
                        id="shelfBin"
                        placeholder="e.g., A-12"
                        value={workflowData.shelfBin || ''}
                        onChange={(e) => updateData('shelfBin', e.target.value)}
                        className="rounded-md"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Temperature Zone</Label>
                      <div className="flex gap-2">
                        {['Cool', 'Ambient', 'Cold'].map((zone) => (
                          <Button
                            key={zone}
                            variant={workflowData.temperatureZone === zone ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                              'rounded-md',
                              workflowData.temperatureZone === zone && 'bg-[#1E3A8A] text-white'
                            )}
                            onClick={() => updateData('temperatureZone', zone)}
                          >
                            {zone}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receivedBy">Received By</Label>
                      <Input
                        id="receivedBy"
                        placeholder="Staff name"
                        value={workflowData.receivedBy || ''}
                        onChange={(e) => updateData('receivedBy', e.target.value)}
                        className="rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receivingDate">Receiving Date</Label>
                      <Input
                        id="receivingDate"
                        type="date"
                        value={new Date().toISOString().split('T')[0]}
                        className="rounded-md"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="warehouseNotes">Warehouse Notes</Label>
                      <Textarea
                        id="warehouseNotes"
                        placeholder="Additional notes..."
                        value={workflowData.warehouseNotes || ''}
                        onChange={(e) => updateData('warehouseNotes', e.target.value)}
                        className="rounded-md min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleGoBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                  <Button onClick={handleProceedToNext} className="bg-[#1E3A8A] hover:bg-[#1E40AF]">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete & Add to Inventory
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
