export interface Term {
  term: string;
  transliteration: string;
  translation: string;
}

export interface Phrase {
  phrase: string;
  transliteration: string;
  translation: string;
}

export interface TinyLessonResponse {
  vocabulary: Term[];
  phrases: Phrase[];
}

export interface GrammarExample {
  sentence: string;
  explanation: string;
}

export interface GrammarTopic {
  topic: string;
  description: string;
  examples: GrammarExample[];
}

export interface GrammarResponse {
  relevantGrammar: GrammarTopic[];
}

export interface DialogueMessage {
  speaker: string;
  message: string;
  notes: string;
}

export interface ConversationResponse {
  context: string;
  dialogue: DialogueMessage[];
}

export interface Descriptor {
  descriptor: string;
  exampleSentence: string;
}

export interface ObjectDescriptorsResponse {
  descriptors: Descriptor[];
}

export interface DetectedObject {
  name: string;
  pronunciation: string;
  translation: string;
  coordinates: number[];
}

export interface DetectObjectsResponse {
  objects: DetectedObject[];
}

export interface ApiError {
  error: string;
}
