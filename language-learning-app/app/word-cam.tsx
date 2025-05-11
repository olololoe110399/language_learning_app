import ErrorView from "@/components/ErrorView";
import LoadingIndicator from "@/components/LoadingIndicator";
import Colors from "@/constants/colors";
import { detectObjects } from "@/services/api";
import { useLanguageStore } from "@/store/languageStore";
import { DetectedObject } from "@/types/api";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function WordCamScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { sourceLanguage, targetLanguage } = useLanguageStore();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(
    null
  );
  const [imageLayout, setImageLayout] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const imageRef = useRef<Image>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageUri) return;

      try {
        const { width, height } = await new Promise<{
          width: number;
          height: number;
        }>((resolve) => {
          Image.getSize(imageUri, (width, height) => {
            resolve({ width, height });
          });
        });
        setImageDimensions({ width, height });
        if (Platform.OS === "web") {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const mimeType = blob.type;
          setMimeType(mimeType);
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            setImageBase64(base64);
            processImage(base64, { width, height });
          };
          reader.readAsDataURL(blob);
        } else {
          const extension = imageUri.split(".").pop()?.toLowerCase() ?? "jpg";
          const mimeMap: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
          };
          const myMimeType = mimeMap[extension] || "application/octet-stream";
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const fullBase64 = `data:${myMimeType};base64,${base64}`;
          setMimeType(myMimeType);
          setImageBase64(fullBase64);
          processImage(fullBase64, { width, height });
        }
      } catch (err) {
        console.error("Error loading image:", err);
        setError("Failed to load image. Please try again.");
        setLoading(false);
      }
    };

    loadImage();
  }, [imageUri]);

  const processImage = async (
    base64Image: string,
    dimensionsImage: { width: number; height: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await detectObjects(
        sourceLanguage,
        targetLanguage,
        base64Image,
        dimensionsImage,
        mimeType || "image/jpeg"
      );
      setDetectedObjects(data.objects);
    } catch (err) {
      setError("Failed to detect objects. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cropImageWeb = async (
    sourceBase64: string,
    coordinates: number[],
    originalDimensions: { width: number; height: number }
  ): Promise<string> => {
    // This function only works on web platform
    if (Platform.OS !== "web") {
      throw new Error("cropImageWeb is only available on web platform");
    }

    // Extract coordinates
    const [x1, y1, x2, y2] = coordinates;

    // Create a canvas to draw the cropped image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas dimensions to the cropped area
    const cropWidth = x2 - x1;
    const cropHeight = y2 - y1;
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Create an HTMLImageElement (only works on web)
    const image = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = sourceBase64;
    });

    // Draw only the cropped portion
    ctx.drawImage(
      image,
      x1,
      y1,
      cropWidth,
      cropHeight, // Source coordinates and dimensions
      0,
      0,
      cropWidth,
      cropHeight // Destination coordinates and dimensions
    );

    // Convert the canvas to base64
    return canvas.toDataURL(mimeType || "image/jpeg");
  };
  const handleObjectPress = async (object: DetectedObject) => {
    setSelectedObject(object);

    try {
      if (!imageBase64 || !imageDimensions) {
        throw new Error("Image not loaded properly");
      }

      let croppedImageBase64;

      if (Platform.OS === "web") {
        // For web, use canvas to crop the image
        croppedImageBase64 = await cropImageWeb(
          imageBase64,
          object.coordinates,
          imageDimensions
        );
      } else {
        // For native platforms, you would use a different approach
        // This is a placeholder for native implementation
        // Consider using a library like react-native-image-manipulator
        console.warn("Image cropping not implemented for native platforms yet");
        croppedImageBase64 = imageBase64;
      }

      // Navigate to the details screen with the cropped image
      router.push({
        pathname: "/object-details",
        params: {
          objectName: object.name,
          imageBase64: encodeURIComponent(croppedImageBase64),
          mimeType: mimeType || "image/jpeg",
        },
      });
    } catch (error) {
      console.error("Error cropping image:", error);
      // Fallback to using the full image if cropping fails
      router.push({
        pathname: "/object-details",
        params: {
          objectName: object.name,
          imageBase64: encodeURIComponent(imageBase64 || ""),
          mimeType: mimeType || "image/jpeg",
        },
      });
    }
  };

  const retryDetection = () => {
    if (imageBase64 && imageDimensions && mimeType) {
      processImage(imageBase64, imageDimensions);
    }
  };

  // Handle the image layout changes to get the actual rendered image dimensions
  const onImageLayout = (event: any) => {
    if (imageRef.current) {
      imageRef.current.measure((x, y, width, height, pageX, pageY) => {
        setImageLayout({
          width,
          height,
          x: pageX,
          y: pageY,
        });
      });
    }
  };

  if (loading) {
    return <LoadingIndicator message="Detecting objects..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={retryDetection} />;
  }

  // Calculate the scaling factors and offset for the object boxes
  const calculateBoxPosition = (coordinates: number[]) => {
    if (!imageDimensions || !imageLayout) return null;

    const [x1, y1, x2, y2] = coordinates;

    // Get the scale of the image as it's rendered (with resizeMode="contain")
    // This accounts for the aspect ratio preservation
    const containerWidth = imageLayout.width;
    const containerHeight = imageLayout.height;
    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = imageDimensions.width / imageDimensions.height;

    let renderedWidth,
      renderedHeight,
      offsetX = 0,
      offsetY = 0;

    // Calculate the actual rendered dimensions of the image
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container, it will be scaled to fit width
      renderedWidth = imageLayout.width;
      renderedHeight = imageLayout.width / imageAspectRatio;
      offsetY = (imageLayout.height - renderedHeight) / 2;
    } else {
      // Image is taller than container, it will be scaled to fit height
      renderedHeight = imageLayout.height;
      renderedWidth = imageLayout.height * imageAspectRatio;
      offsetX = (imageLayout.width - renderedWidth) / 2;
    }

    // Calculate the scale factors
    const scaleX = renderedWidth / imageDimensions.width;
    const scaleY = renderedHeight / imageDimensions.height;

    return {
      left: x1 * scaleX + offsetX,
      top: y1 * scaleY + offsetY,
      width: (x2 - x1) * scaleX,
      height: (y2 - y1) * scaleY,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Word Cam</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={retryDetection}>
          <RefreshCw size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            ref={imageRef}
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLayout={onImageLayout}
          />
        )}

        {imageLayout &&
          detectedObjects.map((object, index) => {
            const boxPosition = calculateBoxPosition(object.coordinates);
            if (!boxPosition) return null;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.objectBox, boxPosition]}
                onPress={() => handleObjectPress(object)}
              />
            );
          })}
      </View>

      <ScrollView style={styles.objectsContainer}>
        <Text style={styles.objectsTitle}>Detected Objects</Text>
        {detectedObjects.length === 0 ? (
          <Text style={styles.noObjectsText}>
            No objects detected. Try another image.
          </Text>
        ) : (
          detectedObjects.map((object, index) => (
            <TouchableOpacity
              key={index}
              style={styles.objectItem}
              onPress={() => handleObjectPress(object)}
            >
              <Text style={styles.objectName}>{object.name}</Text>
              <Text style={styles.objectTranslation}>{object.translation}</Text>
              {object.pronunciation && (
                <Text style={styles.objectPronunciation}>
                  [{object.pronunciation}]
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  objectBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    borderRadius: 4,
  },
  objectsContainer: {
    flex: 1,
  },
  objectsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  noObjectsText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 20,
  },
  objectItem: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  objectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  objectTranslation: {
    fontSize: 16,
    color: Colors.text,
  },
  objectPronunciation: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: "italic",
    marginTop: 4,
  },
});
