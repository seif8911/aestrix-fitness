
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

interface BodyMetrics {
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

export function BodyMetrics() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<BodyMetrics>({
    weight: 0,
    bodyFat: undefined,
    chest: undefined,
    waist: undefined,
    hips: undefined,
    biceps: undefined,
    thighs: undefined,
  });

  const handleChange = (field: keyof BodyMetrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value === "" ? undefined : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const date = new Date().toISOString().split('T')[0];
      const metricsRef = doc(db, `users/${currentUser.uid}/bodyMetrics/${date}`);
      
      await setDoc(metricsRef, {
        ...metrics,
        timestamp: serverTimestamp(),
      });

      alert("Body metrics saved successfully!");
    } catch (error) {
      console.error("Error saving body metrics:", error);
      alert("Error saving body metrics");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={metrics.weight || ""}
                onChange={(e) => handleChange("weight", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat %</Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={metrics.bodyFat || ""}
                onChange={(e) => handleChange("bodyFat", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                value={metrics.chest || ""}
                onChange={(e) => handleChange("chest", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={metrics.waist || ""}
                onChange={(e) => handleChange("waist", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hips">Hips (cm)</Label>
              <Input
                id="hips"
                type="number"
                step="0.1"
                value={metrics.hips || ""}
                onChange={(e) => handleChange("hips", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biceps">Biceps (cm)</Label>
              <Input
                id="biceps"
                type="number"
                step="0.1"
                value={metrics.biceps || ""}
                onChange={(e) => handleChange("biceps", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                type="number"
                step="0.1"
                value={metrics.thighs || ""}
                onChange={(e) => handleChange("thighs", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Metrics
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
