
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { uploadImage } from "@/lib/firebase/storage-service";
import { addProgressPhoto } from "@/lib/firebase/db-service";

export function ProgressPhotos() {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;

    try {
      setUploading(true);
      const timestamp = new Date().getTime();
      const path = `users/${currentUser.uid}/progress-photos/${timestamp}.jpg`;
      const downloadURL = await uploadImage(selectedFile, path);

      await addProgressPhoto(currentUser.uid, {
        url: downloadURL,
        date: new Date().toISOString().split('T')[0],
        timestamp,
      });

      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error uploading progress photo:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-cover" />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-700">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Choose Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
