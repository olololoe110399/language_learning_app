import {
  ConversationResponse,
  DetectObjectsResponse,
  GrammarResponse,
  ObjectDescriptorsResponse,
  TinyLessonResponse,
} from "@/types/api";

const API_URL = " http://0.0.0.0:8000";

// Helper function to make API requests
async function makeRequest<T>(path: string, messages: any): Promise<T> {
  try {
    const response = await fetch(API_URL + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Function to get terms and phrases
export async function getTinyLesson(
  sourceLanguage: string,
  targetLanguage: string,
  purpose: string
): Promise<TinyLessonResponse> {
  const messages = {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    purpose: purpose,
  };

  return makeRequest<TinyLessonResponse>("/terms", messages);
}

// Function to get grammar lessons
export async function getGrammarLesson(
  sourceLanguage: string,
  targetLanguage: string,
  purpose: string
): Promise<GrammarResponse> {
  const messages = {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    purpose: purpose,
  };

  return makeRequest<GrammarResponse>("/grammar", messages);
}

// Function to get conversation examples
export async function getConversation(
  sourceLanguage: string,
  targetLanguage: string
): Promise<ConversationResponse> {
  const messages = {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  };

  return makeRequest<ConversationResponse>("/conversation", messages);
}

// Function to get object descriptors from image
export async function getObjectDescriptors(
  sourceLanguage: string,
  targetLanguage: string,
  objectName: string,
  imageBase64: string,
  mimeType: string
): Promise<ObjectDescriptorsResponse> {
  const messages = {
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    object: objectName,
    image: {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
  };

  return makeRequest<ObjectDescriptorsResponse>(
    "/object-descriptors",
    messages
  );
}

// Function to detect objects in an image
export async function detectObjects(
  sourceLanguage: string,
  targetLanguage: string,
  imageBase64: string,
  dimensions: { width: number; height: number },
  mimeType: string
): Promise<DetectObjectsResponse> {
    const messages = {
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      image: {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
      imageDimensions: dimensions,
    };
  return makeRequest<DetectObjectsResponse>("/detect-objects", messages);
}
