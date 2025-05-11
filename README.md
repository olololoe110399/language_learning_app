# Language Learning App

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/olololoe110399/language_learning_app)

| ![1](https://raw.githubusercontent.com/olololoe110399/language_learning_app/main/screenshots/1.PNG) | ![1](https://raw.githubusercontent.com/olololoe110399/language_learning_app/main/screenshots/2.PNG) | ![2](https://raw.githubusercontent.com/olololoe110399/language_learning_app/main/screenshots/3.PNG) | ![3](https://raw.githubusercontent.com/olololoe110399/language_learning_app/main/screenshots/4.PNG) | ![4](https://raw.githubusercontent.com/olololoe110399/language_learning_app/main/screenshots/5.PNG) |

**Language Learning App** is an AI-powered language learning platform consisting of a FastAPI backend and a React Native (Expo) mobile application. It leverages Google’s Gemini AI to provide personalized learning experiences. The app offers a unified API with four core functionalities: grammar explanations, concise vocabulary lessons (“tiny lessons”), slang conversation practice, and image-based word recognition.

## Goals & Purpose

This project aims to provide a comprehensive language learning tool by covering multiple facets of language acquisition:

* **Grammar Guidance:** Explain grammatical concepts and rules with examples, helping users understand language structure.
* **Vocabulary Lessons:** Offer quick “tiny lessons” to learn new words in context, reinforcing vocabulary through usage examples.
* **Slang & Idioms Practice:** Generate casual conversational scenarios to teach colloquial language, idioms, and slang in a fun, interactive way.
* **Visual Learning (Word Cam):** Recognize objects from images (using the device camera or gallery) and teach their names in the target language, integrating image recognition into language learning.

By addressing grammar, vocabulary, slang, and visual context, the app’s goal is to deliver a well-rounded, engaging language learning experience for users.

## Technologies Used

* **Backend:** Python 3 + FastAPI (high-performance web framework) for building RESTful APIs.

  * *Libraries:* Pydantic (data models & validation), Uvicorn (ASGI server), `google-genai` (to interact with Google’s Gemini AI models).
* **AI Integration:** Google **Gemini AI** – powers the language processing features (grammar explanations, lesson generation, slang dialogues, and image recognition for Word Cam).
* **Frontend:** React Native with **Expo** – a cross-platform mobile app for iOS/Android.

  * *Libraries/Tools:* Expo Router (for navigation), Expo Camera & Image Picker (for Word Cam), Zustand (state management), NativeWind (styling), and various Expo modules (for fonts, auth UI, etc.).
* **Architecture:** The backend is organized in a layered architecture: FastAPI routers for each feature, service classes containing business logic, and Pydantic models defining request/response schemas and settings.

## Installation

### Clone the Repository

```bash
git clone https://github.com/olololoe110399/language_learning_app.git 
cd language_learning_app
```

### Backend Setup

* Ensure **Python 3.10+** is installed.
* Install the dependencies:

  ```bash
  cd backend
  pip install -r requirements.txt
  ```

* Create a `.env` file (or set environment variables) with your Google Gemini API credentials:

  ```env
  GEMINI_API_KEY=<your_google_gemini_api_key>
  ```

### Frontend Setup

* Ensure **Node.js** (or **Bun**) is installed. Install Expo CLI:

  ```bash
  npm install --global eas-cli  
  ```

* Install dependencies:

  ```bash
  cd language-learning-app
  bun install
  ```

## Usage

### Run the Backend Server

```bash
python app/main.py
```

* Access API docs at: `http://localhost:8000/docs`

### Run the Mobile App

```bash
cd language-learning-app
bun start
```

* Use Expo Dev Tools to run the app on a device/emulator.

## Features

The Language Learning App provides four main features:

1. **Grammar Lessons (Grammar API):**

   * Get grammar explanations based on source and target language.
   * Example API: `/grammar/lesson`

2. **Tiny Vocabulary Lessons (Tiny Lesson API):**

   * Generate quick vocabulary lessons with contextual examples.
   * Example API: `/tiny_lesson/lesson`

3. **Slang Conversation Practice (Slang Hang API):**

   * Learn slang and idiomatic expressions through simulated conversations.
   * Example API: `/slang_hang/conversation`

4. **Word Cam (Image-Based Learning API):**

   * Use image recognition to identify objects in images and learn their names in the target language.
   * Example API: `/word_cam/identify`

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

* **Code Style:** Follow the existing code conventions (Python for backend, React Native for frontend).
* **Testing:** Add tests for any new features or bug fixes.
* **Commits:** Use clear and descriptive commit messages.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
